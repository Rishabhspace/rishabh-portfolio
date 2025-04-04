// netlify/functions/chat-bot.js
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);
    const resumeData = JSON.parse(event.body).resumeData;

    // Create the prompt using the resumeData
    const prompt = createPrompt(message, resumeData);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that answers questions about a specific resume.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: data.choices[0].message.content,
      }),
    };
  } catch (error) {
    console.log("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while processing your request",
      }),
    };
  }
};

// Function to create the prompt
function createPrompt(userQuestion, resumeData) {
  return `You are a helpful AI assistant specifically trained to answer questions about the following resume information for ${
    resumeData.name
  }. 
Only answer questions related to this resume information. If the question is unrelated to this person's professional experience, education, skills, certifications, projects, or achievements, politely redirect the conversation back to the resume.

Here is the complete resume information:

NAME: ${resumeData.name}
TITLE: ${resumeData.title}
SUMMARY: ${resumeData.summary}
CONTACT: LinkedIn: ${resumeData.contact.linkedin} | Email: ${
    resumeData.contact.email
  } | Phone: ${resumeData.contact.phone}

EXPERIENCE:
${resumeData.experience
  .map(
    (exp) => `- ${exp.title} at ${exp.company} (${exp.period})
${exp.responsibilities.map((r) => `  * ${r}`).join("\n")}`
  )
  .join("\n")}

EDUCATION:
${resumeData.education
  .map(
    (edu) => `- ${edu.degree} from ${edu.institution} (${edu.period})
  * ${edu.details}`
  )
  .join("\n")}

SKILLS:
- Programming: ${resumeData.skills.programming.join(", ")}
- Web Technologies: ${resumeData.skills.webTechnologies.join(", ")}
- Data Analytics: ${resumeData.skills.dataAnalytics.join(", ")}
- DevOps: ${resumeData.skills.devops.join(", ")}

CERTIFICATIONS:
${resumeData.certifications.map((cert) => `- ${cert}`).join("\n")}

PROJECTS:
${resumeData.projects
  .map(
    (proj) => `- ${proj.name}: ${proj.description}
  * Technologies: ${proj.technologies.join(", ")}`
  )
  .join("\n")}

POSITIONS OF RESPONSIBILITY:
${resumeData.positions
  .map(
    (pos) => `- ${pos.role}, ${pos.organization} (${pos.period})
${pos.details.map((d) => `  * ${d}`).join("\n")}`
  )
  .join("\n")}

ACHIEVEMENTS:
${resumeData.achievements.map((achievement) => `- ${achievement}`).join("\n")}

USER QUESTION: ${userQuestion}

Provide a concise and helpful answer based only on the information above. Keep your answer under 3 sentences unless more detail is specifically required.`;
}
