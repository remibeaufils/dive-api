import {
  Controller,
  Delete,
  Get,
  HttpService,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StoreConfig } from 'src/store-config/schemas/store-config.schema';
import { StoreConfigService } from 'src/store-config/store-config.service';
import { Connector } from './schemas/connector.schema';

@Controller('connectors')
export class ConnectorsController {
  constructor(
    private readonly httpService: HttpService,
    private readonly storesService: StoreConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getConnectors(@Request() req, @Res() res) {
    res.status(200).send([
      {
        id: 'facebook',
        name: 'Facebook Ads',
        icon: 'https://www.facebook.com/images/fb_icon_325x325.png',
      },
      // {
      //   id: 'shopify',
      //   name: 'Shopify Store',
      //   icon: 'https://cdn.shopify.com/assets/images/logos/shopify-bag.png',
      // },
    ]);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getConnector(@Request() req, @Res() res) {
    const STATE = '';

    const connector = {
      id: 'facebook',
      name: 'Facebook Ads',
      icon: 'https://www.facebook.com/images/fb_icon_325x325.png',
      title: 'Connect with Facebook Ads',
      // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
      url: `https://www.facebook.com/v9.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.API_URL}/connectors/facebook/callback&state=${STATE}&scope=ads_read&response_type=granted_scopes code`,
      configured: false,
      adAccounts: null,
    };

    // Get store config for this connector.

    const store: StoreConfig = await this.storesService.findOneByUser(
      req.user.email,
    );

    const config: Connector = store
      ? store.connectors.find(({ id }) => id === req.params.id)
      : null;

    if (!config || !config.token) {
      return res.status(200).send(connector);
    }

    connector.configured = true;

    // Get ad accounts for the token.

    let response = null;

    try {
      response = await this.httpService.axiosRef.get(
        `https://graph.facebook.com/v9.0/me/adaccounts?fields=name,business_name,account_id&access_token=${config.token}`,
      );
    } catch (error) {
      console.log(error);
    }

    let adAccounts = await response.data.data;

    if (adAccounts && adAccounts.length) {
      // Get insights for each account.

      adAccounts = await Promise.all(
        adAccounts.map(async (adAccount) => {
          const response = await this.httpService.axiosRef.get(
            // /insights?fields=account_id,account_name,campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,account_currency,reach,impressions,clicks,cpc,spend&level=ad&time_increment=1&time_range={"since":"2017-01-01","until":"2017-05-15"}
            `https://graph.facebook.com/v9.0/${adAccount.id}/insights?fields=account_currency,cpc,spend&time_range={"since":"2016-09-01","until":"2021-12-31"}&access_token=${config.token}`,
          );

          const insights = await response.data.data;

          return { ...adAccount, insights };
        }),
      );

      // console.log(adAccounts);

      connector.adAccounts = adAccounts.filter(
        (adAccounts) => adAccounts.insights.length,
      );
    }

    res.status(200).send(connector);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteConnector(@Request() req, @Res() res) {
    const store: StoreConfig = await this.storesService.findOneByUser(
      req.user.email,
    );

    const connector: Connector = store.connectors.find(
      ({ id }) => id === req.params.id,
    );

    const response = await this.httpService.axiosRef.delete(
      `https://graph.facebook.com/v9.0/${connector.user.id}/permissions?access_token=${connector.token}`,
    );

    const body = await response.data;

    delete connector.user;
    delete connector.token;

    await this.storesService.updateOne(store);

    res.status(200).json(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('facebook/callback')
  async facebookCallback(@Request() req, @Res() res) {
    if (!req.query.code) {
      return res.status(200).send('error');
    }

    let response = await this.httpService.axiosRef.get(
      `https://graph.facebook.com/v9.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.API_URL}/connectors/facebook/callback&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${req.query.code}`,
    );

    const body = await response.data;

    if (!body.access_token) {
      return res.status(200).send('error');
    }

    // console.log(body.access_token);

    response = await this.httpService.axiosRef.get(
      `https://graph.facebook.com/v9.0/me?fields=name&access_token=${body.access_token}`,
    );

    const user = await response.data;

    const store: StoreConfig = await this.storesService.findOneByUser(
      req.user.email,
    );

    const connector: Connector = store.connectors.find(
      ({ id }) => id === 'facebook',
    );

    if (connector) {
      connector.token = body.access_token;
      connector.user = user;
    } else {
      store.connectors.push({
        id: 'facebook',
        token: body.access_token,
        user,
      });
    }

    await this.storesService.updateOne(store);

    res.writeHead(307, {
      Location: `${process.env.FRONTEND_URL}/connectors/facebook`,
    });

    return res.end();
  }
}
