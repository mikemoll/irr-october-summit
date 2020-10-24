var express = require("express");
var router = express.Router();
const axios = require("axios").default;
const qs = require("qs");

const { db } = require("../db");
const { DATABASE, IDS } = require("../constants/config");
const { CREDS } = require("../CREDENTIALS/CRED");
const { OWNER_DEAL_OBJ } = require("../constants/ownerObj");
const ObjectID = require("mongodb").ObjectID;
const AUTH_URL = `https://accounts.infusionsoft.com/app/oauth/authorize/?client_id=${CREDS.CLIENT_ID}&redirect_uri=${CREDS.REDIRECT_URL}&response_type=code&scope=full`;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Nothing is here");
});
router.get("/authorize", checkTokenExpiry, function (req, res, next) {
  res.render("authorize");
});

router.get("/success", function (req, res, next) {
  var code = req.query.code;

  var config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios
    .post(
      "https://api.infusionsoft.com/token",
      qs.stringify({
        client_id: CREDS.CLIENT_ID,
        client_secret: CREDS.CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: CREDS.REDIRECT_URL,
      }),
      config
    )
    .then(function (response) {
      // console.log(response.data);

      db.collection(DATABASE.TOKENS)
        .updateOne(
          { type: "auth" },
          {
            $set: {
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
              expire_ts: Date.now() + response.data.expires_in * 1000 - 20000,
            },
          },
          { upsert: true }
        )
        .then((result) => {
          res.redirect("/authorize");
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/handleForm", checkTokenExpiry, (req, res) => {
  console.log("Get req");
  console.log(req.body.email);
  getContacts(req, req.body.email)
    .then(async (result) => {
      console.log(result);
      if(result.length > 0){          
        var ownerID = result[0].owner_id;
        var tagID = req.body.tag;
        console.log(ownerID+"-"+tagID);
        if(OWNER_DEAL_OBJ[ownerID]){
          console.log("****");
          console.log(OWNER_DEAL_OBJ[ownerID][tagID]);
          return res.send(OWNER_DEAL_OBJ[ownerID][tagID]);
        }else{
          console.log("++++++");
          console.log( await OWNER_DEAL_OBJ["Other"][tagID]);
          return res.send(OWNER_DEAL_OBJ["Other"][tagID]);
        }
      }else{
        return res.sendStatus(204);
      }
            
    })
    .catch((err) => {
      return res.sendStatus(204);
    });
  
});

function getContactFromID(req, contactId) {
  return new Promise((resolve, reject) => {
    var config = {
      headers: {
        Authorization: "Bearer " + req.access_token,
      },
    };

    axios
      .get(
        `https://api.infusionsoft.com/crm/rest/v1/contacts/${contactId}/tags`,
        // ?optional_properties=lead_source_id`,
        {
          params: {},
          headers: config.headers,
        }
      )
      .then((result) => {
        resolve(result.data);
      })
      .catch((err) => {
        console.log(err);
        resolve(true);
      });
  });
}
function getContacts(req, email) {
  return new Promise((resolve, reject) => {
    var config = {
      headers: {
        Authorization: "Bearer " + req.access_token,
      },
    };

    axios
      .get("https://api.infusionsoft.com/crm/rest/v1/contacts/", {
        params: {
          email:email
        },
        headers: config.headers,
      })
      .then((result) => {
        resolve(result.data.contacts);
      })
      .catch((err) => {
        console.log(err);
        resolve(true);
      });
  });
}

function checkTokenExpiry(req, res, next) {
  db.collection(DATABASE.TOKENS)
    .find({ type: "auth" })
    .toArray((err, data) => {
      if (data != undefined && data.length) {
        var ts = data[0].expire_ts;

        if (ts < Date.now()) {
          refreshToken(data[0].refresh_token).then(
            (data) => {
              // resolve(true);
              req.access_token = data;
              next();
            },
            (reject) => {
              return res.sendStatus(400);
              res.redirect(AUTH_URL);
            }
          );
        } else {
          req.access_token = data[0].access_token;
          next();
        }
      } else {

        res.redirect(AUTH_URL);
      }
    });
}

function refreshToken(refresh_token) {
  return new Promise((resolve, reject) => {
    var config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          CREDS.CLIENT_ID + ":" + CREDS.CLIENT_SECRET
        ).toString("base64")},`,
      },
    };

    axios
      .post(
        "https://api.infusionsoft.com/token",
        qs.stringify({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }),
        config
      )
      .then((response) => {
        db.collection(DATABASE.TOKENS)
          .updateOne(
            { type: "auth" },
            {
              $set: {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expire_ts: Date.now() + response.data.expires_in * 1000 - 20000,
              },
            },
            { upsert: true }
          )
          .then((result) => {
            resolve(response.data.access_token);
          });
      })
      .catch((err) => {
        console.log(err);
        reject(true);
      });
  });
}
module.exports = router;
