# TODO

NOTE: Dev server is already running on localhost:4001. Use the Playwright MCP server to debug it. Commit after major tasks. Make sure the tests pass.

- [x] The trends page crashes the browser. Use Playwright to debug it.
- [x] There are too many categories in the seed. Consolidate them. We can fit about 7 categories on the page. Maybe demographics, sentiment, tools, models, etc.
- [x] Remove the "Home" tab in the navigation.
- [x] The survey trends page doesn't load once you click on Demographics. Use Playwright to debug the performance on /trends
- [x] In the nav bar, don't show the login/logout button until we know if the user is logged in or out. (Right now the login button flashes when the user is logged in -- best to hide it until we know if the user is logged in or out)
- [ ] Make separate pages for each category on the /survey and /trends page, like /survey/demographics and /trends/demographics. Make the root survey page redirect to the first category, and make the root trends page redirect to overview.
- [ ] Unify the colors between the results page and the trends page. The trends page uses rainbow colors and the results page uses orange-like pastels. Standardize these and use Tailwind colors: https://tailwindcss.com/docs/colors
- [ ] Trends performance is abysmal.
- [ ] Add tests that add some sample data and responses and make sure that the data endpoints used by results and trends are working correctly.