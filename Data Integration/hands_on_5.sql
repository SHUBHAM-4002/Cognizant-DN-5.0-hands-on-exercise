// =========================================
// HANDS-ON 5
// MongoDB - Document Modelling, CRUD & Aggregation
// Student Management System
// =========================================


// =========================================
// TASK 1 : CREATE COLLECTION & INSERT DOCUMENTS
// =========================================

use student_management_db

db.createCollection("student_activities")

db.student_activities.insertMany([
{
student_id:1,
name:"Yash",
department:"ECE",
year:4,
activities:["Hackathon","Workshop","Coding Contest"],
skills:["Python","Flask","SQL"],
attendance:92,
certificates:[
{
title:"Python Programming",
provider:"Infosys Springboard"
}
]
},
{
student_id:2,
name:"Rahul",
department:"CSE",
year:3,
activities:["Seminar","Hackathon"],
skills:["Java","SQL"],
attendance:85,
certificates:[
{
title:"Java Programming",
provider:"NPTEL"
}
]
},
{
student_id:3,
name:"Priya",
department:"IT",
year:2,
activities:["Workshop","Paper Presentation"],
skills:["Python","HTML"],
attendance:96,
certificates:[
{
title:"Web Development",
provider:"Coursera"
}
]
},
{
student_id:4,
name:"Anjali",
department:"ECE",
year:1,
activities:["Coding Contest"],
skills:["C","Python"],
attendance:88
},
{
student_id:5,
name:"Karthik",
department:"AI & DS",
year:4,
activities:["Hackathon","Project Expo"],
skills:["Machine Learning","Python"],
attendance:91
}
])

// Verify

db.student_activities.countDocuments()

// =========================================
// TASK 2 : CRUD OPERATIONS
// =========================================

// Q1
// Display all students

db.student_activities.find()

// =========================================

// Q2
// Students from ECE Department

db.student_activities.find(
{
department:"ECE"
}
)

// =========================================

// Q3
// Students with Attendance above 90

db.student_activities.find(
{
attendance:
{
$gt:90
}
}
)

// =========================================

// Q4
// Display only Name and Department

db.student_activities.find(
{},
{
_id:0,
name:1,
department:1
}
)

// =========================================

// Q5
// Update Attendance

db.student_activities.updateOne(
{
student_id:2
},
{
$set:
{
attendance:90
}
}
)

// Verify

db.student_activities.find(
{
student_id:2
}
)

// =========================================

// Q6
// Add New Skill

db.student_activities.updateOne(
{
student_id:1
},
{
$push:
{
skills:"MongoDB"
}
}
)

// Verify

db.student_activities.find(
{
student_id:1
}
)

// =========================================

// Q7
// Delete First Year Students

db.student_activities.deleteMany(
{
year:1
}
)

// Verify

db.student_activities.find()

// =========================================
// TASK 3 : AGGREGATION PIPELINE
// =========================================

// Q8
// Department-wise Student Count

db.student_activities.aggregate([
{
$group:
{
_id:"$department",
total_students:
{
$sum:1
}
}
},
{
$sort:
{
total_students:-1
}
}
])

// =========================================

// Q9
// Average Attendance Department-wise

db.student_activities.aggregate([
{
$group:
{
_id:"$department",
average_attendance:
{
$avg:"$attendance"
}
}
},
{
$sort:
{
average_attendance:-1
}
}
])

// =========================================

// Q10
// Most Common Skills

db.student_activities.aggregate([
{
$unwind:"$skills"
},
{
$group:
{
_id:"$skills",
count:
{
$sum:1
}
}
},
{
$sort:
{
count:-1
}
}
])

// =========================================

// Q11
// Students having Python Skill

db.student_activities.find(
{
skills:"Python"
}
)

// =========================================
// TASK 4 : CREATE INDEX
// =========================================

// Create Index on Department

db.student_activities.createIndex(
{
department:1
}
)

// Verify Performance

db.student_activities.find(
{
department:"ECE"
}
).explain("executionStats")

// =========================================
// DOCUMENTATION
// =========================================

// MongoDB stores data as JSON-like documents.
//
// Arrays such as skills and activities are
// stored naturally without creating separate tables.
//
// Aggregation pipelines are used for analytics,
// reporting and dashboards.
//
// Indexes improve search performance by reducing
// collection scans.

// =========================================
// END OF HANDS-ON 5
// =========================================