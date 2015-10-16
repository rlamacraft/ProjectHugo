__author__ = 'Robert'

import urllib.parse
import urllib.request
import json

# TODO: Reduce duplicate code

def get_request(domain, username, url):
    url = domain + '/' + username + '/' + url
    req = urllib.request.Request(url)
    response = urllib.request.urlopen(req)
    return response.read().decode('ascii')


def put_request(domain, username, url, data):
    url = domain + '/' + username + '/' + url
    json_data = json.dumps(data)
    binary_data = json_data.encode('ascii')
    req = urllib.request.Request(url, binary_data)
    req.get_method = lambda: 'PUT'
    response = urllib.request.urlopen(req)
    return response.read()


def post_request(domain, username, url, data):
    url = domain + '/' + username + '/' + url
    json_data = json.dumps(data)
    binary_data = json_data.encode('ascii')
    req = urllib.request.Request(url, binary_data)
    # inclding binary data, defaults from GET to POST
    response = urllib.request.urlopen(req)
    return response.read()


def delete_request(domain, username, url):
    url = domain + '/' + username + '/' + url
    req = urllib.request.Request(url)
    req.get_method = lambda: 'DELETE'
    response = urllib.request.urlopen(req)
    return response.read()
