Prompting Examples: Poor vs Good

Poor Example
add tests for foo.py

Good Example
write a new test case for foo.py, covering the edge case where the user is logged out. avoid mocks

Poor Example
why does ExecutionFactory have such a weird api?

Good Example
look through ExecutionFactory's git history and summarize how its api came to be

Poor Example
add a calendar widget

Good Example
look at how existing widgets are implemented on the home page to understand the patterns and specifically how code and interfaces are separated out. HotDogWidget.php is a good example to start with. then, follow the pattern to implement a new calendar widget that lets the user select a month and paginate forwards/backwards to pick a year. Build from scratch without libraries other than the ones already used in the rest of the codebase.