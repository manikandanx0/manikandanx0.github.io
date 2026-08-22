---
draft: false
tags:
  - ml
  - basics
excerpt: A brief introduction to machine learning by google.
date: 2026-08-17
title: Intro To Machine Learning
---
This is a mostly a walk through of a course at [Google Developers - Machine Learning](https://developers.google.com/machine-learning/intro-to-ml/) and part of my own research. 
So without messing around lets get right to it.

## What is Machine learning?
> Machine learning is the process of training a piece of software, called a model to make useful predictions or generate content from data.

Machine learning in a simpler sense is when insights are gathered about a data to make a prediction close to human prediction.

The process of gathering such insights is called learning.

The alternative to ML is rule based, sometimes hard coded systems which are hard to code and maintain.

Under the hood, each ML model is a mathematical and logical construct that infinitesimally tries to predict the correct result
### Types of ML Systems
There are three types of basic systems or learning methods
1. Supervised learning
2. Unsupervised learning
3. Reinforcement learning

All ML systems require large quantities of data. The more there is to learn from the better the model will be. But there are certain caveats and inconsistencies - That's a discussion for a later day.

However each ML system has their own way of "learning" from data. The system and the choice of learning may vary for different reasons like the data available or the end goal of the model.
#### Supervised learning
Supervised learning is when a model is trained using clearly labeled data, meaning each input is mapped to a correct output.

Two major supervised learning systems are,
1. Regression
2. Classification

##### Regression
A Regression model predicts a numeric value. 
For example, it *predicts* the price of a house from factors like number of bedrooms, floors etc.

##### Classification
A Classification model predicts the likelihood that something belongs to a category. For example, it *classifies* if an email is spam or not based on parameters.

There are two types of classification.
1. Binary classification - between two choices
2. Multi-class classification - between more than two choices

#### Unsupervised learning
Unsupervised learning model aims to learn meaningful pattern in a dataset. They don't require an output field. 
It usually involves grouping similar data together - This is known as clustering.

**Clustering** differs from classification because the categories aren't defined by the developer but the model.

#### Reinforcement learning
Reinforcement learning (RL) aims to learn from trial and error.
It makes predictions by getting rewards or penalties based on the action performed within an environment.

RL is used to train robots to perform tasks, like walking.
Famous example of an successful RL model is [AlphaZero](https://deepmind.google/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/) which arguably became the strongest chess bot.

