# TODO

NOTE: Dev server is already running on localhost:4001. Use the Playwright MCP server to debug it. Commit often.

- [ ] The trends page crashes the browser. Use Playwright to debug it.
- [ ] There are too many categories in the seed. Consolidate them. We can fit about 7 categories on the page. Maybe demographics, sentiment, tools, models, etc.
- [ ] Remove the "Home" tab in the navigation.
- [ ] The survey trends page doesn't load once you click on Demographics. Use Playwright to debug the performance on /trends
- [ ] Make separate pages for each category on the /survey and /trends page, like /survey/demographics and /trends/demographics. Make the root survey page redirect to the first category, and make the root trends page redirect to overview.
- [ ] In the nav bar, don't show the login/logout button until we know if the user is logged in or out. (Right now the login button flashes when the user is logged in -- best to hide it until we know if the user is logged in or out)
- [ ] Unify the colors between the results page and the trends page. The trands page uses rainbow colors and the results page uses orange-like pastels. Standardize these and use Tailwind colors: https://tailwindcss.com/docs/colors
- [ ] Add tests that add some sample data and responses and make sure that the data endpoints used by results and trends are working correctly.