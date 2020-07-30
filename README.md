# **5 Metrics for visualisation of a serverless function**

## 1. Compute service to execute code on demand

A serverless compute service used to provision servers, virtual machines or containers should be used.
Run this via a Function as a Service code infrastructure.
This makes it easier to manage environments.

## 2. Functions with a single aim

Write functions that do one thing, this makes it easier to test and debug code.

## 3. Push based event driven principles

Create push-based, event-driven pipelines to carry out complex computations and tasks. 
Use a compute service to orchestrate actions between different services.

## 4. Third-party services
Reduce the amount of custom code you use, and instead leverage services built by others
Be mindful of the risk involved in doing so.

## 5. End-to-End Security

These include:

Input and request validation.
Secure secrets storage and retrieval.
User execution roles and invocation policies.
Data encryption.
Metering and throttling access.
Regulatory compliance concerns.