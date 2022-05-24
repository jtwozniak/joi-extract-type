/** @format */

import Joi from 'joi';
import '../../index';

const REDIRECT_MAX_UTM_ATTR_LEN = 10;
const REDIRECT_MAX_DESCRIPTION_LEN = 10;
const REDIRECT_MAX_VANITY_PATH_LEN = 10;
const REDIRECT_MIN_VANITY_PATH_LEN = 10;
const REDIRECT_MAX_URL_LEN = 10;

const version = 9;
const validateUTMParam = Joi.string().max(REDIRECT_MAX_UTM_ATTR_LEN).allow(null).default(null);

const validators = {
  id: Joi.string().required(),
  createdBy: Joi.string().description('User id').required(),
  updatedBy: Joi.string().description('User id').required(),
  createdAt: Joi.date()
    .default(() => new Date(), 'Time of creation')
    .required(),
  updatedAt: Joi.date()
    .default(() => new Date(), 'Time of creation')
    .required(),
  description: Joi.string().max(REDIRECT_MAX_DESCRIPTION_LEN).allow(null).default(null),
  category: Joi.string()
    .valid(['sales', 'marketing', 'events', 'support', 'internal app'])
    .required(),
  destinationUrl: Joi.string().uri({ scheme: 'https' }).max(REDIRECT_MAX_URL_LEN).required(),
  vanityPath: Joi.string()
    .regex(/^[-a-z0-9]+$/)
    .max(REDIRECT_MAX_VANITY_PATH_LEN)
    .min(REDIRECT_MIN_VANITY_PATH_LEN)
    .lowercase()
    .allow(null)
    .default(null),
  utmSource: validateUTMParam,
  utmMedium: validateUTMParam,
  utmCampaign: validateUTMParam,
  utmContent: validateUTMParam,
};

const publicSchema = Joi.object(validators);

// These keys should never to sent to anyone
const schema = publicSchema.keys({
  version: Joi.number().valid(version).default(version),
});



type Type = Joi.pullType<typeof publicSchema>;

let v: Type = {  };