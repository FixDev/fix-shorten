import { nanoid } from 'nanoid';
import Url from '../models/Url.js';
import validateUrl from '../utils/utils.js';
import dotenv from 'dotenv';
dotenv.config();

class CustomShortUrlDigit {
  // Decorator
  base = process.env.BASE;
  constructor(useCustomUrl, howMuch, customUrl) {
    this.useCustomUrl = useCustomUrl;
    this.howMuch = howMuch;
    this.customUrl = customUrl;
  }

  generateCustomeUrl = (isRandom = true) => {
    if (isRandom) {
      const length = this.useCustomUrl ? this.howMuch : 21;
      return `${this.base}/${nanoid(length)}`;
    }
    return `${this.base}/${this.customUrl}`;
  };
}

class ShortUrl {
  index = async (req, res) => {
    try {
      const url = await Url.findOne({ urlId: req.params.urlId });
      if (url) {
        await Url.updateOne(
          {
            urlId: req.params.urlId,
          },
          { $inc: { clicks: 1 } }
        );
        setTimeout(() => {
          return res.redirect(url.origUrl);
        }, 3000);
      } else res.status(404).json('Not found');
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  };
  short = async (req, res) => {
    const { origUrl, useCustomUrl, howMuch } = req.body;

    if (useCustomUrl && typeof howMuch === 'undefined') {
      return res.status(300).json('Tolong Isi HowMuch');
    }

    if (validateUrl(origUrl)) {
      try {
        let url = await Url.findOne({ origUrl });
        if (url) {
          res.json(url);
        } else {
          const CustomUrl = new CustomShortUrlDigit(useCustomUrl, howMuch, '');
          const shortUrl = CustomUrl.generateCustomeUrl(); // implementasi decorator
          const urlId = shortUrl.split('/')[3];
          console.log(shortUrl);
          console.log(urlId);
          url = new Url({
            origUrl,
            shortUrl,
            urlId,
            date: new Date(),
          });

          await url.save();
          res.json(url);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json('Server Error');
      }
    } else {
      res.status(400).json('Invalid Original Url');
    }
  };
  shortWithCustomUrl = async (req, res) => {
    const { origUrl, useCustomUrl, customUrl } = req.body;

    const howMuch = customUrl.length;

    if (howMuch >= 21) {
      res.status(400).json('Url kustom terlalu panjang');
    }

    if (validateUrl(origUrl)) {
      try {
        let url = await Url.findOne({ origUrl });
        if (url) {
          res.json(url);
        } else {
          const CustomUrl = new CustomShortUrlDigit(
            useCustomUrl,
            howMuch,
            customUrl
          );
          const shortUrl = CustomUrl.generateCustomeUrl(false); // implementasi decorator
          const urlId = shortUrl.split('/')[3];
          console.log(shortUrl);
          console.log(urlId);
          url = new Url({
            origUrl,
            shortUrl,
            urlId,
            date: new Date(),
          });

          await url.save();
          res.json(url);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json('Server Error');
      }
    } else {
      res.status(400).json('Invalid Original Url');
    }
  };
}

const shortUrl = new ShortUrl();

export default shortUrl;
