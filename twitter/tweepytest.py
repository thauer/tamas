import tweepy
from secrets import consumer_secret, access_token_secret

consumer_key = 'gQuzl3bZykN5EZq0FWY7pEJPI'
access_token = '44858297-ZO6wB4cxRa2l1clyMwElvKIdtlZO34vDDxpmRGXXI'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

public_tweets = api.home_timeline()
for tweet in public_tweets:
    print tweet.text
