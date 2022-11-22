import path from 'path';
import {
  generateOTPToken,
  generateQRCode,
  generateUniqueSecret,
  verifyOTPToken,
} from '../helpers/2fa.js';

const __dirname = path.resolve();

const MOCK_USER = {
  username: 'bachbntdev',
  password: 'Bach@18051998',
  is2FAEnabled: true,
  secret: generateUniqueSecret(),
};

const getLoginPage = async (req, res) => {
  return res.sendFile(path.join(`${__dirname}/src/views/login.html`));
};

const getEnable2FAPage = async (req, res) => {
  return res.sendFile(path.join(`${__dirname}/src/views/enable2FA.html`));
};

const getVerify2FAPage = async (req, res) => {
  return res.sendFile(path.join(`${__dirname}/src/views/verify2FA.html`));
};

const postLogin = async (req, res) => {
  try {
    let user = MOCK_USER;
    const { username, password } = req.body;
    console.log(username);
    if (username === user.username && password === user.password) {
      console.log('1');
      if (user.is2FAEnabled) {
        console.log('2');
        return res.status(200).json({
          isCorrectIdentifier: true,
          is2FAEnabled: true,
          isLoggedIn: false,
        });
      }
      console.log('3');
      return res.status(200).json({
        isCorrectIdentifier: true,
        is2FAEnabled: false,
        isLoggedIn: true,
      });
    }
    console.log('4');
    return res.status(200).json({
      isCorrectIdentifier: false,
      is2FAEnabled: false,
      isLoggedIn: false,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const postEnable2FA = async (req, res) => {
  try {
    let user = MOCK_USER;
    const serviceName = 'bachbntdev.web.app';
    const otpAuth = generateOTPToken(user.user, serviceName, user.secret);

    const QRCodeImage = await generateQRCode(otpAuth);
    return res.status(200).json({ QRCodeImage });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const postVerify2FA = async (req, res) => {
  try {
    let user = MOCK_USER;
    const { otpToken } = req.body;

    const isValid = verifyOTPToken(otpToken, user.secret);
    return res.status(200).json({ isValid });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export {
  getLoginPage,
  getEnable2FAPage,
  getVerify2FAPage,
  postLogin,
  postEnable2FA,
  postVerify2FA,
};
