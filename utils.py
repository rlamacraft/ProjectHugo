__author__ = 'Robert'

import json
from hue_requests import post_request
from hue_requests import get_request
from hue_requests import delete_request


####################
# COLOUR CONVERTERS
####################


# TODO: RGB and HEX
# TODO: Base and Accent
# TODO: Separate util colours file?

def triple_convertion(hue, sat, bri):
    out_hue = hue_converter(hue)
    out_sat = sat_converter(sat)
    out_bri = bri_converter(bri)
    return('"hue": ' + str(out_hue) + ",\n" +
           '"sat": ' + str(out_sat) + ",\n" +
           '"bri": ' + str(out_bri) + ",\n")


# converts hue in degrees (x/360) to Hue system value (n/65535)
def hue_converter(degree):
    return round(degree/360*65535)


# converts sat in percentage (x/100) to Hue system value (n/255)
def sat_converter(percentage):
    return round(percentage/100*254)


# converts bri in percentage (x/100) to Hue system value (n/255)
def bri_converter(percentage):
    return round(percentage/100*254)


####################
# SCHEDULES
####################

def get_all_schedules(domain, username):
    url = "schedules"
    return get_request(domain, username, url)


def create_schedule(domain, username, name, desc, group, action, when):
    url = "schedules"
    address = "/api/" + username + "/groups/" + group + "/action"
    params = {
        "name": name,
        "description": desc,
        "command": {  # note: commands are limited to 90 chars
            "address": address,
            "method": "PUT",
            "body": action
        },
        "localtime": when
    }
    post_request(domain, username, url, params)


def delete_schedule(domain, username, schedule_id):
    delete_request(domain, username, "schedules/" + schedule_id)


def delete_schedule_from_name(domain, username, name):
    all_schedules_json = get_request(domain, username, "schedules")
    all_schedules = json.loads(all_schedules_json)
    for key, value in all_schedules.items():
        if value['name'] == name:
            delete_request(domain, username, "schedules/" + key)
            print("deleted a schedule with name '" + name + "'")
