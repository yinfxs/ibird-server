/**
 * 内置路由：界面登录
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');
const i18nUtils = require('../utils/i18n');

module.exports = (router) => {
    router.post('/signin', async (ctx) => {
        try {
            const rawData = await token.condition(ctx);
            if (!rawData) throw new Error(i18nUtils(ctx, 'login_failed'));
            const tokenData = await token.authorization(Promise.resolve(rawData));
            ctx.cookies.set(token.COOKIETOKEN, tokenData.access_token, {
                maxAge: tokenData.expires_in * 1000
            });
            if (tokenData.data && tokenData.data[token.useridKey]) {
                ctx.cookies.set(token.COOKIEUSERID, tokenData.data[token.useridKey], {
                    maxAge: tokenData.expires_in * 1000
                });
            }
            ctx.body = {
                data: tokenData
            }
        } catch (e) {
            ctx.body = {
                errmsg: i18nUtils(ctx, 'login_failed'),
                errcode: 500
            }
        }
    });
};