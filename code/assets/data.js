// Seed data for the Bridgr prototype (sample internships are illustrative, not real listings).
window.BRIDGR_DATA = {
  roles: {
    "Data Analyst Intern": { must_have: [["SQL",5,3],["Excel",4,3],["Python",4,3],["Statistics",4,3],["Data Visualization",4,3],["Pandas",3,3]], good_to_have: [["Power BI",3,2],["Tableau",3,2],["Communication",3,3]] },
    "Frontend Developer Intern": { must_have: [["HTML",4,3],["CSS",4,3],["JavaScript",5,3],["React",5,3],["Git",4,3],["Responsive Design",3,3]], good_to_have: [["TypeScript",3,2],["Tailwind CSS",2,2],["Testing",2,2]] },
    "Backend Developer Intern": { must_have: [["Node.js",5,3],["SQL",4,3],["REST APIs",5,3],["Git",4,3],["Data Structures & Algorithms",4,3]], good_to_have: [["Docker",3,2],["MongoDB",3,2],["Cloud",2,2]] },
    "ML Engineer Intern": { must_have: [["Python",5,4],["Machine Learning",5,3],["Pandas",4,3],["NumPy",3,3],["Statistics",4,3],["Scikit-learn",4,3]], good_to_have: [["Deep Learning",3,2],["PyTorch",3,2],["SQL",3,2]] },
    "Cloud / DevOps Intern": { must_have: [["Linux",5,3],["AWS",5,3],["Docker",4,3],["Git",4,3],["CI/CD",4,2],["Networking",3,2]], good_to_have: [["Kubernetes",3,2],["Terraform",2,2],["Python",2,2]] },
    "Cybersecurity Analyst Intern": { must_have: [["Networking",5,3],["Linux",4,3],["Security Fundamentals",5,3],["Python",3,2],["OWASP Top 10",4,3]], good_to_have: [["Wireshark",3,2],["SIEM",3,2],["Cloud",2,2]] },
    "UI/UX Design Intern": { must_have: [["Figma",5,3],["User Research",4,3],["Wireframing",4,3],["Visual Design",4,3],["Prototyping",4,3]], good_to_have: [["HTML",2,2],["Design Systems",3,2],["Communication",3,3]] },
    "Product Management Intern": { must_have: [["Communication",5,4],["User Research",4,3],["Data Analysis",4,3],["Product Thinking",5,3],["SQL",3,2]], good_to_have: [["Figma",2,2],["Agile",3,2],["Excel",3,3]] }
  },
  internships: [
    { id: "IN01", title: "Data Analyst Intern", company: "FinEdge Analytics", location: "Bengaluru · Hybrid", stipend: 25000, duration: "6 months", skills: ["SQL","Excel","Python","Power BI","Statistics"], domain: "Data", deadline: "2026-12-15", tone: "dark" },
    { id: "IN02", title: "Frontend Developer Intern", company: "PixelCraft Studios", location: "Remote", stipend: 20000, duration: "3 months", skills: ["React","JavaScript","CSS","Git","Tailwind CSS"], domain: "Web", deadline: "2026-12-10", tone: "light" },
    { id: "IN03", title: "ML Engineer Intern", company: "NeuroNest AI", location: "Hyderabad · On-site", stipend: 40000, duration: "6 months", skills: ["Python","Machine Learning","PyTorch","Pandas","SQL"], domain: "AI", deadline: "2026-12-20", tone: "dark" },
    { id: "IN04", title: "Backend Developer Intern", company: "CartKart", location: "Gurugram · Hybrid", stipend: 30000, duration: "6 months", skills: ["Node.js","MongoDB","REST APIs","Docker","Git"], domain: "Web", deadline: "2026-12-05", tone: "light" },
    { id: "IN05", title: "Cloud / DevOps Intern", company: "SkyStack Cloud", location: "Pune · On-site", stipend: 28000, duration: "4 months", skills: ["AWS","Linux","Docker","CI/CD","Kubernetes"], domain: "Cloud", deadline: "2026-12-30", tone: "dark" },
    { id: "IN06", title: "Cybersecurity Analyst Intern", company: "ShieldWorks", location: "Noida · On-site", stipend: 22000, duration: "6 months", skills: ["Networking","Linux","OWASP Top 10","Wireshark","Python"], domain: "Security", deadline: "2026-12-18", tone: "light" },
    { id: "IN07", title: "UI/UX Design Intern", company: "Studio Kora", location: "Remote", stipend: 18000, duration: "3 months", skills: ["Figma","User Research","Prototyping","Wireframing"], domain: "Design", deadline: "2026-12-12", tone: "light" },
    { id: "IN08", title: "Product Management Intern", company: "Lernly EdTech", location: "Bengaluru · Hybrid", stipend: 35000, duration: "6 months", skills: ["Product Thinking","SQL","Communication","User Research","Agile"], domain: "Product", deadline: "2027-01-05", tone: "dark" },
    { id: "IN09", title: "Full Stack Intern", company: "GreenGrid Energy", location: "Chennai · Hybrid", stipend: 26000, duration: "6 months", skills: ["React","Node.js","SQL","Git","REST APIs"], domain: "Web", deadline: "2026-12-22", tone: "light" },
    { id: "IN10", title: "Business Intelligence Intern", company: "RetailIQ", location: "Mumbai · On-site", stipend: 24000, duration: "4 months", skills: ["Tableau","SQL","Excel","Data Visualization"], domain: "Data", deadline: "2026-12-28", tone: "dark" },
    { id: "IN11", title: "Computer Vision Research Intern", company: "IIT Research Park Lab", location: "Chennai · On-site", stipend: 15000, duration: "6 months", skills: ["Python","Deep Learning","OpenCV","PyTorch"], domain: "AI", deadline: "2027-01-10", tone: "light" },
    { id: "IN12", title: "Android Developer Intern", company: "Paywise", location: "Remote", stipend: 25000, duration: "3 months", skills: ["Kotlin","Android","Git","REST APIs"], domain: "Mobile", deadline: "2026-12-14", tone: "dark" }
  ],
  sampleProfile:
    "Ananya Verma, 3rd year B.Tech CSE (AI/ML specialisation), CGPA 8.4.\n" +
    "Courses: Data Structures, DBMS (SQL, normalisation), Probability & Statistics, Machine Learning (theory), Python Programming.\n" +
    "Projects: (1) Movie recommender in Python with Pandas and Scikit-learn (collaborative filtering, 0.82 precision@10). " +
    "(2) College event website using HTML, CSS and basic JavaScript, hosted on GitHub Pages.\n" +
    "Certifications: Google Data Analytics (Coursera). Solved 150 LeetCode problems in Python.\n" +
    "Interests: data science, analytics, AI products. Comfortable with Excel pivot tables and Git basics.",
  sampleJD:
    "We are hiring a Data Analyst Intern (6 months, Bengaluru). You will write SQL queries on our PostgreSQL warehouse, build dashboards in Power BI, " +
    "clean data with Python (Pandas), run A/B test analysis and present insights to product managers. Must have: strong SQL, Excel, Python, " +
    "basic statistics (hypothesis testing). Good to have: Power BI or Tableau, dbt, communication skills.",
  sampleSyllabus:
    "Course: Database Management Systems (B.Tech CSE Sem 4)\nUnit 1: Introduction, file systems vs DBMS, ER model, network & hierarchical models.\n" +
    "Unit 2: Relational model, relational algebra, tuple calculus.\nUnit 3: SQL — DDL, DML, joins, sub-queries, views.\n" +
    "Unit 4: Normalisation 1NF–BCNF, functional dependencies.\nUnit 5: Transactions, ACID, concurrency control, recovery.\nLab: Oracle SQL*Plus exercises.",
  demand: { // illustrative demand index across 12 seed internships + roles
    labels: ["SQL","Python","Git","React","REST APIs","Excel","Docker","Machine Learning","Linux","Communication","Figma","AWS"],
    industry: [92,88,80,64,60,58,55,52,48,70,30,45],
    curriculum: [75,70,25,10,15,40,5,45,35,20,5,8]
  }
};
