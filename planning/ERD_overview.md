## ERD v1
v1 of the ERD includes all the tables needed to get the following features working:
* Workout sessions
* Scheduler
* Matcher

The **users** table contains all information about the user including account details and personal details. Workout interests and goals are connected using an intermediary table since a user can have many interests and goals. A “reliability_score” will also be calculated for users and stored in this table.

The **sessions** table contains information about scheduled workout sessions. Options for the “state” column will include “pending”, “active”, “completed” and “canceled”. 
Since there can be multiple users in a session, we will join the two using the **session_users** table.

The **ratings** table will store the ratings that users provide at the end of workout sessions. The options for “rating” will just be “good” and “bad”.