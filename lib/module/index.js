import { NativeModules, Platform } from 'react-native';
const LINKING_ERROR = `The package 'react-native-juicebox-sdk' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const RNJuiceboxSdk = NativeModules.RNJuiceboxSdk ? NativeModules.RNJuiceboxSdk : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});

/**
 * Error returned during `Client.register`
 */
export let RegisterError = /*#__PURE__*/function (RegisterError) {
  RegisterError[RegisterError["InvalidAuth"] = 0] = "InvalidAuth";
  RegisterError[RegisterError["UpgradeRequired"] = 1] = "UpgradeRequired";
  RegisterError[RegisterError["Assertion"] = 2] = "Assertion";
  RegisterError[RegisterError["Transient"] = 3] = "Transient";
  return RegisterError;
}({});

/**
 * Error returned during `Client.recover`
 */
export class RecoverError {
  /**
   * Guesses remaining is only valid if `reason` is `InvalidPin`
   */

  /**
   * The reason recovery failed.
   */

  constructor(reason, guessesRemaining) {
    this.reason = reason;
    this.guessesRemaining = guessesRemaining;
  }
}

/**
 * The reason recovery failed.
 */
export let RecoverErrorReason = /*#__PURE__*/function (RecoverErrorReason) {
  RecoverErrorReason[RecoverErrorReason["InvalidPin"] = 0] = "InvalidPin";
  RecoverErrorReason[RecoverErrorReason["NotRegistered"] = 1] = "NotRegistered";
  RecoverErrorReason[RecoverErrorReason["InvalidAuth"] = 2] = "InvalidAuth";
  RecoverErrorReason[RecoverErrorReason["UpgradeRequired"] = 3] = "UpgradeRequired";
  RecoverErrorReason[RecoverErrorReason["Assertion"] = 4] = "Assertion";
  RecoverErrorReason[RecoverErrorReason["Transient"] = 5] = "Transient";
  return RecoverErrorReason;
}({});

/**
 * Error returned during `Client.delete`
 */
export let DeleteError = /*#__PURE__*/function (DeleteError) {
  DeleteError[DeleteError["InvalidAuth"] = 0] = "InvalidAuth";
  DeleteError[DeleteError["UpgradeRequired"] = 1] = "UpgradeRequired";
  DeleteError[DeleteError["Assertion"] = 2] = "Assertion";
  DeleteError[DeleteError["Transient"] = 3] = "Transient";
  return DeleteError;
}({});

/**
 * A 16-byte hexadecimal identifier for a realm.
 */

/**
 * A 16-byte hexadecimal identifier for a secret.
 */

/**
 * A JWT token used for authentication with a `Realm`.
 */

/**
 * A record of authentication token for a given `Realm`.
 */

/**
 * The parameters used to configure a `Realm`.
 */

/**
 * Defines how the provided PIN will be hashed before register and
 * recover operations.
 */
export let PinHashingMode = /*#__PURE__*/function (PinHashingMode) {
  PinHashingMode["Standard2019"] = "Standard2019";
  PinHashingMode["FastInsecure"] = "FastInsecure";
  return PinHashingMode;
}({});

/**
 * The parameters used to configure a `Client`.
 */

/**
 * Configuration for on device authentication.
 */

export default {
  register: async (c, a, p, s, i, g) => {
    try {
      await RNJuiceboxSdk.register(JSON.stringify(c), a, Array.from(p), Array.from(s), Array.from(i), g);
    } catch (e) {
      // @ts-ignore
      switch (e.code) {
        case 'invalidAuth':
        case 'INVALID_AUTH':
          throw RegisterError.InvalidAuth;
        case 'upgradeRequired':
        case 'UPGRADE_REQUIRED':
          throw RegisterError.UpgradeRequired;
        case 'assertion':
        case 'ASSERTION':
          throw RegisterError.Assertion;
        case 'transient':
        case 'TRANSIENT':
          throw RegisterError.Transient;
      }
      throw e;
    }
  },
  recover: async (c, a, p, i) => {
    try {
      const secret = await RNJuiceboxSdk.recover(JSON.stringify(c), a, Array.from(p), Array.from(i));
      return Uint8Array.from(secret);
    } catch (e) {
      // @ts-ignore
      switch (e.code) {
        case 'invalidAuth':
        case 'INVALID_AUTH':
          throw new RecoverError(RecoverErrorReason.InvalidAuth, undefined);
        case 'upgradeRequired':
        case 'UPGRADE_REQUIRED':
          throw new RecoverError(RecoverErrorReason.UpgradeRequired, undefined);
        case 'notRegistered':
        case 'NOT_REGISTERED':
          throw new RecoverError(RecoverErrorReason.NotRegistered, undefined);
        case 'assertion':
        case 'ASERTION':
          throw new RecoverError(RecoverErrorReason.Assertion, undefined);
        case 'transient':
        case 'TRANSIENT':
          throw new RecoverError(RecoverErrorReason.Transient, undefined);
        case 'INVALID_PIN':
          // @ts-ignore
          throw new RecoverError(RecoverErrorReason.InvalidPin,
          // @ts-ignore
          e.userInfo.guessesRemaining);
      }
      const regex = /guessesRemaining:\s(\d+)/;
      // @ts-ignore
      const match = regex.exec(e.code);
      if (match) {
        throw new RecoverError(RecoverErrorReason.InvalidPin,
        // @ts-ignore
        parseInt(match[1], 10));
      }
      throw e;
    }
  },
  delete: async (c, a) => {
    try {
      await RNJuiceboxSdk.delete(JSON.stringify(c), a);
    } catch (e) {
      // @ts-ignore
      switch (e.code) {
        case 'invalidAuth':
        case 'INVALID_AUTH':
          throw DeleteError.InvalidAuth;
        case 'upgradeRequired':
        case 'UPGRADE_REQUIRED':
          throw DeleteError.UpgradeRequired;
        case 'assertion':
        case 'ASSERTION':
          throw DeleteError.Assertion;
        case 'transient':
        case 'TRANSIENT':
          throw DeleteError.Transient;
      }
      throw e;
    }
  },
  createAuthentication: (c, s, u) => RNJuiceboxSdk.createAuthentication(c.realms.map(realm => realm.id), JSON.stringify(s), u),
  randomSecretId: RNJuiceboxSdk.randomSecretId
};
//# sourceMappingURL=index.js.map