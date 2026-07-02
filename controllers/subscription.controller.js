import Subscription from "../models/subscription.model.js";
import {workflowClient} from "../config/upstash.js";
import {SERVER_URL} from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try {
        if(!SERVER_URL) {
            const error = new Error("SERVER_URL is required to trigger subscription reminder workflows");
            error.statusCode = 500;
            throw error;
        }

        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

    const {workflowRunId} = await workflowClient.trigger({
    url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
    body: {
    subscriptionId: subscription._id,
     },
     headers: {
        "Content-Type": "application/json",
     },
     retries: 0
    })
        res.status(201).json({success: true, data: {subscription, workflowRunId}});

    } catch (e) {
        next(e);
    }
}

export const getUserSubscription = async (req,res,next) => {
    try {
        // Check if the user is authorized to access this subscription
        if(req.user.id != req.params.id){
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({success: true, data: subscriptions});

    }

    catch (e) {
        next(e);
    }
}

export const cancelSubscription = async (req,res,next) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            {_id: req.params.id, user: req.user._id},
            {status: "canceled"},
            {new: true},
        )

        if(!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.status === "canceled") {
          const error = new Error("Subscription is already canceled");
          error.statusCode = 400;
          throw error;
        }

        res.status(200).json({success: true, data: subscription});
       }
    catch (e) {
        next(e);
    }
}

export const deleteSubscription = async (req,res,next) => {
    try {
        const subscription = await Subscription.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if(!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: subscription});
    }
    catch (e) {
        next(e);
    }
}
