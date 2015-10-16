__author__ = 'Robert'

from utils import create_schedule
from utils import delete_schedule
from hue_requests import get_request
from config import username
from config import domain
import json


def delete_all_hugo_alarms():
    all_existing_schedules = json.loads(get_request(domain, username, "schedules"))
    for each_key, each_alarms in all_existing_schedules.items():
        if each_alarms['description'].startswith('Hugo:'):
            print(" - Deleting existing Hugo schedule: '" + each_alarms['name'] + "'")
            delete_schedule(domain, username, each_key)


def create_all_hugo_alarams():
    json_file = open('alarms.json', 'r')
    alarms = json.loads(json_file.read())

    for each_alarm in alarms:
        desc = "Hugo: " + each_alarm['desc']
        create_schedule(domain, username, each_alarm['name'], desc,
                        each_alarm['group'], each_alarm['action'], each_alarm['when'])
        print(" - Create Hugo schedule: '" + each_alarm['name'] + "'")


delete_all_hugo_alarms()
print("***")
create_all_hugo_alarams()
print("***")
print("Alarms updated.")
