// Older prompt versions kept runnable for the iteration log (v3 = final, in _prompts.js).
export const VERSIONS = {
  P3: {
    v1: {
      temperature: 1.0,
      system: "none",
      user: "Compare this student's skills with this job and tell me how well they match.\nStudent: {student_skills}\nJob: {role_requirements}"
    },
    v2: {
      temperature: 0.7,
      system: "You are a career assessor. Compare a student's skills with a role's requirements and return JSON.",
      user:
        "STUDENT SKILLS:\n{student_skills}\n\nROLE REQUIREMENTS:\n{role_requirements}\n\n" +
        'Return JSON: {"match_score":0-100,"matched":[string],"missing":[string],"verdict":string}'
    }
  },
  P9: {
    v1: {
      temperature: 1.0,
      system: "none",
      user: "Evaluate this interview answer.\nQuestion: {question}\nAnswer: {answer}"
    },
    v2: {
      temperature: 0.5,
      system: "You are an interview coach. Score answers 0-10 and return JSON.",
      user:
        "QUESTION: {question}\nIDEAL POINTS: {ideal_points}\nANSWER: {answer}\n\n" +
        'Return JSON: {"score":0-10,"feedback":string}'
    }
  }
};
