// Chatbot Functionality
document.addEventListener("DOMContentLoaded", function () {
  const chatMessages = document.getElementById("chatMessages");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  const RESUME_DATA = {
    name: "Rishabh Kumar",
    title:
      "Integrated. M.Tech. Geological Technology Student with Minor in Economics",
    summary:
      "Integrated M.Tech. student at IIT Roorkee with hands-on experience in machine learning, data analysis, and web development. Skilled in Python programming, pipeline development, and diverse technologies including MongoDB, AWS, and Git, with demonstrated ability to build data-driven applications and optimize workflows through automation.",
    experience: [
      {
        company: "Niigata University Japan",
        title: "Field Science Research",
        period: "May 2023 - July 2023",
        responsibilities: [
          "Conducted detailed studies of 4 sedimentary outcrops to understand the flow and sedimentation processes",
          "Collaborated in 2 laboratory research at Niigata University and INPEX, focusing on natural hazards and natural gas",
          "Explored the UNESCO Fossa Magna Museum and studied one of the sections of North American-Eurasian fault lines",
        ],
      },
    ],
    education: [
      {
        institution: "Indian Institute of Technology Roorkee",
        degree: "Int. M.Tech. Geological Technology | Minor in Economics",
        period: "2021 - 2026",
        details: "GPA: 8.227/10.0",
      },
      {
        institution: "Central Public School, Samastipur (CBSE)",
        degree: "Intermediate (Class XII)",
        period: "2020",
        details: "Percentage: 82%",
      },
      {
        institution: "D.A.V. Public School, Samastipur (CBSE)",
        degree: "Matriculate (Class X)",
        period: "2018",
        details: "Percentage: 98.8%",
      },
    ],
    skills: {
      programming: ["C++", "Python"],
      webTechnologies: [
        "HTML",
        "CSS",
        "JS",
        "NodeJS",
        "Express",
        "MongoDB",
        "PHP",
        "React",
        "MySQL",
      ],
      dataAnalytics: [
        "Pandas",
        "Numpy",
        "Matplotlib",
        "SQL",
        "Excel",
        "Tableau",
        "Power BI",
      ],
      devops: ["Azure", "AWS", "Git", "GCP", "Docker"],
    },
    certifications: [
      "Summer Analytics (IIT Guwahati)",
      "Machine Learning Specialization (Andrew Ng)",
    ],
    projects: [
      {
        name: "Stock Sentiment Analysis",
        description:
          "Achieved 51.03% portfolio return using a sentiment-based trading strategy on 10+ stocks with 0.97 accuracy. Incorporated varied text datasets to enhance overall model performance, leading to reduced prediction errors by 15%.",
        technologies: ["Finance", "Machine Learning", "Sentiment Analysis"],
      },
      {
        name: "Inventory Demand Forecasting",
        description:
          "Implemented the XGBoost ML algorithm to predict inventory demand, reducing stockouts & overstock by 20%. Evaluated historical data trends and analytics to fine-tune inventory levels, achieving a 30% increase in on-time delivery.",
        technologies: ["XGBoost", "Machine Learning", "Data Analytics"],
      },
      {
        name: "Conference Management Portal",
        description:
          "Spearheaded the development of CMP, streamlining processes reducing administrative processing time by 60%. Optimized workflows for abstracts, registration, e-certificates, and payments, reducing transaction inquiries by 30%.",
        technologies: [
          "HTML 5",
          "CSS",
          "JavaScript",
          "Node.js",
          "Express.js",
          "EJS",
          "MongoDB",
          "Git",
        ],
      },
      {
        name: "ChatWiz",
        description:
          "Developed a text-based chatting website with OpenSSL encryption, ensuring secure communication for 100s of users.",
        technologies: [
          "HTML 5",
          "CSS",
          "JavaScript",
          "PHP",
          "MySQL",
          "Apache",
          "Git",
          "AWS",
        ],
      },
    ],
    positions: [
      {
        role: "Events Secretary, Student Mentorship Program",
        organization: "IIT Roorkee",
        period: "June 2024 - Present",
        details: [
          "Collaborated in a diverse team of 73 members to foster connections between senior students and freshers at IIT Roorkee",
          "Directed the planning and implementation of seven impactful career guidance workshops at IIT Roorkee",
        ],
      },
      {
        role: "Deputy General Secretary, Wellness Center",
        organization: "IIT Roorkee",
        period: "August 2023 - May 2024",
        details: [
          "Led a team of 5 members in development of a Counselling Portal for students, promoting emotional well-being on campus",
          "Promoted mental health awareness and supported students by booking 100+ counselling appointments with counsellors",
        ],
      },
    ],
    achievements: [
      "Finalist, Dark Pattern Buster Hackathon 2024",
      "Received HoD's Letter of Appreciation for outstanding academic performance in 3rd Year of Undergraduate",
      "Secured International Rank 50 & State Rank 1 in Mathematics Olympiad in 2018",
      "Secured State Rank 20 in NTSE Exam 2017",
    ],
    contact: {
      linkedin: "rishabh-kumar-37240222a",
      email: "rishabhiitroorkee@gmail.com",
      phone: "+91-9431654716",
    },
  };

  // Function to add message to chat
  function addMessage(message, isUser) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Loading indicator
  function showLoadingIndicator() {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message bot-message";
    loadingDiv.id = "loadingIndicator";
    loadingDiv.textContent = "Thinking...";
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }

  // Function to handle user input
  async function handleUserInput() {
    const message = userInput.value.trim();
    if (message !== "") {
      addMessage(message, true);
      userInput.value = "";

      showLoadingIndicator();

      try {
        // Call the Netlify function instead of directly calling GROQ
        const response = await fetch("/.netlify/functions/chat-bot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            resumeData: RESUME_DATA,
          }),
        });

        const data = await response.json();

        removeLoadingIndicator();

        if (data.error) {
          addMessage(
            "I'm having trouble processing your request. Please try again.",
            false
          );
          console.error("Error:", data.error);
        } else {
          addMessage(data.message, false);
        }
      } catch (error) {
        removeLoadingIndicator();
        addMessage(
          "I'm having trouble processing your request. Please try again.",
          false
        );
        console.error("Error:", error);
      }
    }
  }

  sendBtn.addEventListener("click", handleUserInput);
  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleUserInput();
    }
  });
});
