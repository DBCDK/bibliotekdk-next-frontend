Translations are handled here.
To translate a string wrap it in translate() method and add it to translate.json file
eg.
in code:
translate("heroTxt")

in Translate.json:
"heroTxt": {
"da": "Afhent lokalt eller tilgå digitalt",
"en": "Pick up locally or access digitally"
},

The REAL translation is handled by backend:
http://bibdk-backend-www-master.febib-prod.svc.cloud.dbc.dk/

Actually there are two backends:
staging:
http://bibdk-backend-www-master.febib-staging.svc.cloud.dbc.dk/
and prod:
http://bibdk-backend-www-master.febib-prod.svc.cloud.dbc.dk/
Translations are transferred from prod to staging every now and then. So translations on staging server are NOT permanent but overwritten on transfers.
Translation on prod are permanent.

REMEMBER
After you added a string to translate as described above you need to run
a curl command to update the backend with the new translation to prod:

`curl -X POST -H "Content-Type: application/json" -d @Translate.json http://bibdk-backend-www-master.febib-prod.svc.cloud.dbc.dk/update_translations`

When developing you want to push to staging server as well (to see translations on alfa.stg.bibliotek.dk and localhost):
`curl -X POST -H "Content-Type: application/json" -d @Translate.json http://bibdk-backend-www-master.febib-staging.svc.cloud.dbc.dk/update_translations`

It must be run in the directory where this README.md resides. If not
you must pass the path to Translate.json file.

To get the translations run:
`curl -X POST -H "Content-Type: application/json" -d @Translate.json http://bibdk-backend-www-master.febib-prod.svc.cloud.dbc.dk/get_translations`

Again you need to pass Translate.json file
