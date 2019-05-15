# Technical test

Made the 16/05/2019 by Jason Forest.

In the programming questions I used NodeJS (version 8.15.1)


## Question 1

For this question I'm using a simple strategy where I parse the input string into an array of floats and then insert the numbers in different buckets - each bucket being one of the intervals.
The size of the smallest bucket will give me the number of elements I need to balance the data set.

This strategy is extremely naive and would not scale for high number of data points.
In that situation I would stream the input into chunks and balance each chunk separately. The chunk size would be a parameter to optimise.  

The language I used is Javascript (NodeJS) and the code is split in two files so that the data handling can be called in a series of unit tests.

Regarding the testing I tested several "happy path" scenario to make sure the data is correctly dispatched into the different buckets.
Then, I tested the balancing of the buckets by making the input unbalanced in various ways.
I finally tested error scenarios where you don't want alphabetical characters, empty inputs and values out of range.

Please note that it is a deliberate choice to **not** test the script by calling it using a process mechanism like `exec`. By unit-testing a function I limit the resources used by the tests and do not waiste time testing the out-of-the-box NodeJS mechanism to read stdin.  

I decided to use only modules included in NodeJS by default.
For a real application I would use a test runner framework like Jest, Jasmine, Mocha, etc.

To run the script, use the following:

```
$ echo 0.1,0.3,0.5,0.7,0.9 | node balance.js
0.1,0.3,0.5,0.7,0.9
```

The tests can be executed by calling the following command:

```
$ node balance-tests.js
```

If all the tests pass, the script will return without any message. This is a limitation of the simple and quite crude `assert` module.
With a proper framework, the tests would be green when passing and red otherwise and would be mush easier to integrate to a continous integration plateform.


## Question 2

### Part 1 - High Level Design

The game would be composed of 2 types of objects:

- The world: a plan with coordinates and a list of visible moving objects.
- A moving object (spaceship or asteroid or missile): characterised by its type, its position in the world (two coordinates), its orientation (an angle), its current speed and its acceleration.

The game mechanism is a loop that evaluates at each tick the position of all the moving objects present in the visible world and renders them.
Obviously, the game allows some controls to move the spaceship (by changing its orientation and speed) and fire the missile.

For simplicity let's assume that at the beginning of one game, the asteroid will be rendered at one border of the world with a random "good" orientation and a constant speed (so that it will cross a large part of the world)
Another assumption could be that the spaceship is rendered initially at the center of the world and has one missile only.

It is also much simpler to assume that no external forces (gravitation) would curve the trajectories of the moving objects.


### Part 2 - Objects

Regarding the code design, the moving objects share the same characteristics (properties). They are physical objects moving at a certain speed in the simulated world.
In a programming language using classes and inheritance mechanism it would be a good idea to have an abstract class for moving objects and then children classes for each of the three different types.

It is also worth noting that the asteroid and the missile are very similar as they are both moving in a straight line with no way for the player to change their course. We can probably use one type of object (one class) with a different property for the type.

In a Class oriented language, we could imagine a method `getNewPosition` to compute the new position of the moving object at the next tick given its current position, speed and orientation.
The objects would also need some getters and setters for their properties.

For the case of the spaceship the new position method would overwrite the inherited one to take into account the player's interaction.

Now, I have to admit that given my current Javascript "set of mind", I would not use classes and methods.
I would treat the objects as simple javascript objects - each one being just a set of properties.
I would use a separate function to compute the new position of each object.

### Part 3 

The question here is to compute if the missile will reach the asteroid. 

Let's first state that because we are using a cartesian plan, we can find the equations of the two trajectories `Ya` (for the asteroid) and `Ym` (for the missile) using their positions and orientations.
We can also compute the coordinates of the point of intersection: it is the resolution of the equation `Ya = Ym`.

Now, one way of simplifying the computation (a.k.a. cheating!) would be to assume that the asteroid and the missile are traveling at the same speed.
To check if the asteroid would be hit, would mean to calculate the equation of the two trajectories and then the coordinate of the intersection of those two lines.
If the intersection is at the same distance of the spaceship and the asteroid it means the missile will reach the asteroid at the correct time.

Now, if the speed of the missile and the speed of the asteroid are different, we still need to compute the intersection of the two lines but this time we need to use some proportions.
For instance, if the speed of the missile is twice the speed of the asteroid, its distance to the intersection needs to be half of the distance between the asteroid and the intersection.
To generalise, we want that `Da * Sm = Dm * Sa`
Where:

- Da is the distance between the asteroid and the point of impact (the intersection)
- Dm is the distance between the missile and the point of impact
- Sa is the speed of the asteroid
- Sm is the speed of the missile.

## Question 3

I'll start by trying to assess how much data one car is gathering in one second and I will extrapolate from that.

It seems reasonable to assume that an autonomous car has at least: one camera, six distance sensors, a GPS, an accelerometer, a compass and a speed sensor.
This is to record data coming from the environment of the car. We will not look at the data coming from the inside of the car (The data gathered when a human is driving the car to use imitation learning algorithms for instance or the data of the internals of the car like the temperature of the engine, the RPM, etc.)

Let's pretend we have good algorithms that can work with a low-resolution video. The camera would records videos at a rate of 10 MB per second.

Let's also assume that we trigger the sensors 20 times per seconds and each swipe is returning a distance in centimetres. A float is 4 bytes. That gives 20 * 6 * 4 equals 480 bytes per second.

For the GPS, the compass and the speed sensors we can assume respectively 3 floats, one integer and one integer. These sensors are probably less critical and we can do a measure only once per second. This is 20 bytes per seconds.

Let's round the whole thing to 10 MB per seconds because, in comparison, the video feed is the information consuming all the storage.

In one week, a car will drive 5 days (2 days of rest and maintenance) and no more than 8 hours per day (all the stops and the quiet time at night). This represents 40 hours per week (144 000 seconds) or 1 440 000 000 Bytes of data for one car in a week. For 10 cars we are approaching 15 Tera bytes per week.

This is obviously a very rough approximation probably far from the reality. The variability is quite high. For instance, switching to a better video resolution would multiply by 10 the storage required.
Finally, this is only for the raw data, the data derived from the onboard algorithm like the models, the generated meta data, the segmented images, etc. is not taken into account.

I would be really interested to know what kind of data management you are using.


## Question 4

For this question I decided to write a little program able to explore the different configurations of the game.

The heart of the code is the recursive function `playMoveAndContinue` that makes a move and then stop if there is a winner (or a stalemate) or continue the exploration by calling itself on all the possible moves on the board.

The code is in the `tictactoe.js` file and it can be run using Node JS with the command: `node tictactoe.js`.

The output is the number of possible configurations for each number of moves:

```
$ node tictactoe.js
5 1440
6 5328
7 47952
8 72576
9 127872
Total: 255168
```

It is interesting to note that the total number of configurations is not `9!` but not that far.
This is because the winning configurations prune the tree of possible configurations.

Other interesting facts:

- As expected, all the results are divisible by 4 because of the symmetry axis of the grid.
- While implementing the function to check if the game has a winner, I almost forgot the diagonals!
- I had very weird results at some point and I realised that I wasn't checking for stalemate...


## Question 5

I have to admit that I really enjoyed working on this little brain teaser!

At first, given the fact that the two cars are facing the same direction and have the exact same code, I thought the goal was to demonstrate that the problem has no solution.

But then I noticed that the exercise was highlighting the craters made by the cars.
It took me several minutes to find that the trick is that one car will drive on **two** craters and this is the event that allows the two cars to have different behaviours.

Indeed, the set of instructions for the program has only one test instruction: the monkey one and this test involves the crater.

The following program solves the riddle:

```
1: ->
2: ->
3: <-
4: Monkey
5: 1
6: ->
7: ->
8: ->
9: 6
```

Let's detail the execution. At the impact the two cars start executing the program.
They will move two steps forward and one step backward.
The distance between the two cars will stay the same.
Because no car drive on a crater, the execution goes back to line 1 and the program loops.

At some point one car will hit a crater and the Monkey instruction line 4 will allow the execution flow to skip line 5.
This car is now in another loop (lines 6 to 9) that allows it three steps forward when the other car in front is only moving one step forward (2 front, 1 back)
The car following will cover three times the distance and will eventually catch up and crash into the other one.
