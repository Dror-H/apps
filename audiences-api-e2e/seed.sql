INSERT INTO "users" ("id", "email", "name", "password", "stripe_customer_id", "email_verified", "profile_picture", "is_admin") VALUES
('04a9cf55-22da-4efa-9e01-228866689764', 'emmerson_cfwlarg_gaios@tfbnw.net', 'emmerson gaios', NULL, NULL, 'f', 'https://scontent.xx.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c15.0.50.50a_cp0_dst-jpg_p50x50&_nc_cat=1&ccb=1-6&_nc_sid=12b3be&_nc_ohc=_Qh_yFn0xmQAX9Ll6BG&_nc_ht=scontent.xx&edm=AHgPADgEAAAA&oh=00_AT9yAWNELs20SH87EVSjWv5cczXaNv75dVCkfmifV_5_CQ&oe=62A0D999', 'f');

INSERT INTO "public"."auth_tokens" ("id", "user_id", "access_token", "status", "provider", "provider_client_id", "expires_at", "created_at") VALUES
('04a9cf55-22da-4efa-9e01-228866689764', '04a9cf55-22da-4efa-9e01-228866689764', 'EAAtkQZBG2nUgBAFGOHMUHMYlnoOPYs4UgwMstmdQl07gteZCJZACdmzpqtICZAcB9HocMi8lbV7a6mfr4TOak8a1eTLK6IerafEqJ0Qd9s0qo4ilI0rlnNEc94tfK6MbDyKZBhkeBNgj2hGT5iApyfC045K2nTKRXyHKj2OwL0ZBGiQ2Mi53oCby9XMPZCBgtwTVyLhMSwPJBfWuJmuE1uWRuNz1yW5OqEQhlwcGBv1dwZDZD', 'active', 'facebook', '3278437282186540', '2022-09-06 16:43:14.845', '2022-07-08 14:38:17.565');


INSERT INTO "public"."ad_accounts" ("id", "name", "provider", "status", "business_profile_picture", "synchronized", "created_at", "currency", "business_city", "business_country_code", "business_name", "business_zip", "min_daily_budget", "business_id", "campaign_id", "adset_id") VALUES
('act_1390312014489081', 'Instizone', 'facebook', 'DISABLED', 'https://scontent-vie1-1.xx.fbcdn.net/v/t31.18172-1/14195321_1001469875264_8424695334849083916_o.png?stp=dst-png_p100x100&_nc_cat=102&ccb=1-7&_nc_sid=872a9a&_nc_ohc=jGAwjhFNT18AX8hm0nL&_nc_ht=scontent-vie1-1.xx&edm=AMXLtCYEAAAA&oh=00_AT8vLi0V2qFGzXAFoodoPfuCo69Q124Puzo9FpqDPmkeyA&oe=62ECE7A9', 'f', '2022-07-08 14:38:18.708', 'EUR', 'Vienna', 'AT', 'Instizone', '1190', '97', '1028601307598122', NULL, NULL),
('act_586338851914346', 'Insticore 2020', 'facebook', 'ACTIVE', 'https://scontent-vie1-1.xx.fbcdn.net/v/t1.6435-9/52602369_247140049557878_4302450816951779328_n.jpg?stp=dst-jpg_p100x100&_nc_cat=109&ccb=1-7&_nc_sid=eb6dd6&_nc_ohc=Df72DlRyKNEAX-bZmwp&_nc_ht=scontent-vie1-1.xx&edm=AMXLtCYEAAAA&oh=00_AT_lxZna23WpWPClsWpx0Tkq6SUG8RgthGL8-A3_LXwNhw&oe=62EF74B7', 'f', '2022-07-08 14:38:18.707', 'EUR', NULL, 'RO', 'Insticore', NULL, '97', '270791743528520', NULL, NULL);


INSERT INTO "public"."_ad_account_to_user" ("A", "B") VALUES
('act_586338851914346', '04a9cf55-22da-4efa-9e01-228866689764'),
('act_1390312014489081', '04a9cf55-22da-4efa-9e01-228866689764');


