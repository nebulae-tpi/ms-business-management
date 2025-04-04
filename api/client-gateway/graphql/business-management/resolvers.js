const { CustomError } = require("../../tools/customError");
const RoleValidator = require("../../tools/RoleValidator");
const withFilter = require("graphql-subscriptions").withFilter;
const PubSub = require("graphql-subscriptions").PubSub;
const pubsub = new PubSub();
const broker = require("../../broker/BrokerFactory")();
const contextName = "Business-Management";
const { of } = require("rxjs");
const { mergeMap, catchError, map } = require("rxjs/operators");

//Every single error code
// please use the prefix assigned to this microservice.
const INTERNAL_SERVER_ERROR_CODE = 1;
const BUSINESS_PERMISSION_DENIED_ERROR_CODE = 2;


function getResponseFromBackEnd$(response) {
  return of(response).pipe(
    map(resp => {
      if (resp.result.code != 200) {
        const err = new Error();
        err.name = "Error";
        err.message = resp.result.error;
        err.stack = err.stack;
        Error.captureStackTrace(err, "Error");
        throw err;
      }
      return resp.data;
    })
  );
}

/**
 * Handles errors
 * @param {*} err
 * @param {*} operationName
 */
function handleError$(err, methodName) {
  return of(err).pipe(
    map(err => {
      const exception = { data: null, result: {} };
      const isCustomError = err instanceof CustomError;
      if (!isCustomError) {
        err = new CustomError(
          err.name,
          methodName,
          INTERNAL_SERVER_ERROR_CODE,
          err.message
        );
      }
      exception.result = {
        code: err.code,
        error: { ...err.getContent() }
      };
      return exception;
    })
  );
}


module.exports = {
  //// QUERY ///////
  Query: {
    getBusinessByFilterText(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "getBusinessByFilterText",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN"]
      )
        .pipe(
          mergeMap(() =>
            broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.query.getBusinessByFilterText",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ), 
          catchError(err => handleError$(err, "getBusinessByFilterText")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },  
    myBusiness(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "myBusiness",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["BUSINESS-OWNER", "PLATFORM-ADMIN", "POS", "POI", "SATELLITE", "OPERATOR", "BUSINESS-ADMIN", "BUSINESS-VIEWER", "COORDINATOR", "DISCIPLINARY-COMMITTEE", "OPERATION-SUPERVISOR"]
      )
        .pipe(
          mergeMap(() =>
            broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.query.myBusiness",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "myBusiness")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    getBusiness(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "getBusiness",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN"]
      )
        .pipe(
          mergeMap(() =>
            broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.query.getBusiness",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "getBusiness")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    getBusinesses(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "getBusinesses",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN", "CLIENT"]
      )
        .pipe(
          mergeMap(() =>
            broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.query.getBusinesses",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "getBusinesses")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    getBusinessesCities(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "getBusinessesCities",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN", "CLIENT"]
      )
        .pipe(
          map(() =>{
            return [
              {
                generalInfo: {
                  name: "Cali",
                },
                _id: "75cafa6d-0f27-44be-aa27-c2c82807742d"},
              {
                generalInfo: {
                  name: "Bogotá"
                },
                _id: "7d95f8ef-4c54-466a-8af9-6dd197dd920a"
              },
              {
                generalInfo: {
                  name: "Medellín"
                },
                _id: "bf2807e4-e97f-43eb-b15d-09c2aff8b2ab"
              },
              {
                generalInfo: {
                  name: "Villavicencio"
                },
                _id: "ec600f7f-1b57-4c47-af77-c6750a8649bd"
              },
              {
                generalInfo: {
                  name: "Zona Cafetera"
                },
                _id: "b19c067e-57b4-468f-b970-d0101a31cacb"
              }
            ]
          }),
        )
        .toPromise();
    },
    getBusinessCount(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "getBusinessCount",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN"]
      )
        .pipe(
          mergeMap(() =>
            broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.query.getBusinessCount",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "getBusinessCount")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    }
  },
  

  //// MUTATIONS ///////
  Mutation: {
    persistBusiness(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "persistBusiness",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN"]
      )
        .pipe(
          mergeMap(() =>
            context.broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.mutation.persistBusiness",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "persistBusiness")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    updateBusinessGeneralInfo(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "updateBusinessGeneralInfo",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN"]
      )
        .pipe(
          mergeMap(() =>
            context.broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.mutation.updateBusinessGeneralInfo",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "updateBusinessGeneralInfo")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    updateBusinessAttributes(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "updateBusinessAttributes",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN"]
      )
        .pipe(
          mergeMap(() =>
            context.broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.mutation.updateBusinessAttributes",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "updateBusinessAttributes")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    updateBusinessState(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "updateBusinessAttributes",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN"]
      )
        .pipe(
          mergeMap(() =>
            context.broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.mutation.updateBusinessState",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "updateBusinessState")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    updateBusinessContactInfo(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        contextName,
        "updateBusinessContactInfo",
        BUSINESS_PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN"]
      )
        .pipe(
          mergeMap(() =>
            context.broker.forwardAndGetReply$(
              "Business",
              "clientgateway.graphql.mutation.updateBusinessContactInfo",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "updateBusinessContactInfo")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
  },
  //// SUBSCRIPTIONS ///////
  Subscription: {
    BusinessUpdatedSubscription: {
      subscribe: withFilter(
        (payload, variables, context, info) => {
          //Checks the roles of the user, if the user does not have at least one of the required roles, an error will be thrown
          RoleValidator.checkAndThrowError(
            context.authToken.realm_access.roles,
            ["PLATFORM-ADMIN"],
            contextName,
            "BusinessUpdatedSubscription",
            BUSINESS_PERMISSION_DENIED_ERROR_CODE,
            "Permission denied"
          );

          return pubsub.asyncIterator("BusinessUpdatedSubscription");
        },
        (payload, variables, context, info) => {
          return true;
        }
      )
    }
  }
};

//// SUBSCRIPTIONS SOURCES ////
const eventDescriptors = [
  {
    backendEventName: "BusinessUpdatedSubscription",
    gqlSubscriptionName: "BusinessUpdatedSubscription",
    dataExtractor: evt => evt.data, // OPTIONAL, only use if needed
    onError: (error, descriptor) =>
      console.log(`Error processing ${descriptor.backendEventName}`), // OPTIONAL, only use if needed
    onEvent: (evt, descriptor) =>
      console.log(`Event of type  ${descriptor.backendEventName} arraived`) // OPTIONAL, only use if needed
  }
];



/**
 * Connects every backend event to the right GQL subscription
 */
eventDescriptors.forEach(descriptor => {
  broker.getMaterializedViewsUpdates$([descriptor.backendEventName]).subscribe(
    evt => {
      if (descriptor.onEvent) {
        descriptor.onEvent(evt, descriptor);
      }
      const payload = {};
      payload[descriptor.gqlSubscriptionName] = descriptor.dataExtractor
        ? descriptor.dataExtractor(evt)
        : evt.data;
      pubsub.publish(descriptor.gqlSubscriptionName, payload);
    },

    error => {
      if (descriptor.onError) {
        descriptor.onError(error, descriptor);
      }
      console.error(`Error listening ${descriptor.gqlSubscriptionName}`, error);
    },

    () => console.log(`${descriptor.gqlSubscriptionName} listener STOPED!!`)
  );
});
