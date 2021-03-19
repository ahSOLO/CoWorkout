## ERD v1
v1 of the ERD includes all the tables needed to get the following features working:
* Workout sessions
* Scheduler
* Matcher

The **users** table contains all information about the user including account details and personal details. Workout interests and goals are connected using an intermediary table since a user can have many interests and goals.

The **sessions** table contains information about scheduled workout sessions. Options for the “state” column will include “pending”, “active”, “completed” and “canceled”. 
Since there can be multiple users in a session, we will join the two using the **session_users** table.

The **ratings** table will store the ratings that users provide at the end of workout sessions. The options for “rating” will just be 1 for good and 0 for bad.

Activity Types:
1. Cardio
2. Weight Training
3. Yoga
4. Circuit
5. HIIT
6. Stretching

Session User States:
- pending
- ready
- joined
- complete
- no show
- canceled
