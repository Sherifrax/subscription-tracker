import dayjs from "dayjs";
import {createRequire} from "module";
const require = createRequire(import.meta.url);
const {serve} = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";

const REMINDERS = [7,5,2,1]; // Days before renewal date to send reminders

export const sendReminders = serve(async (context) => {
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== "active")  return; 
     
    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Subscription ${subscriptionId} has expired. Sending expiration email to ${subscription.user.email}`);
        // Here you would send an email to the user notifying them that their subscription has expired.
    }

    for(const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, "day");

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days`, reminderDate);
            await triggerReminder(context, `Reminder ${daysBefore} days`);
        }
    }

 });


 const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
 }

 const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`)

    await context.sleepUntil(label, date.toDate());
 }

 const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder for subscription`);
        // Send email, SMS, or push notification to the user here.
    })
 }
