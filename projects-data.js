// Projects Data Configuration
// Update this file to manage all your projects easily

const projectsData = {
  // Showcase Projects (Featured Projects)
  showcase: [
    {
      id: 1,
      title: "Flutter Ludo Game",
      tag: "Flutter · Game",
      description: "Multiplayer board game with polished animations, real-time audio cues, and linked data structures for dynamic dice logic.",
      image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80",
      links: {
        code: "https://github.com/RahulRakhi/Ludo_Game",
        live: "https://ludocartoon.netlify.app/"
      },
      linkLabels: {
        code: "View Code",
        live: "Play Live"
      }
    },
    {
      id: 2,
      title: "Immersive Portfolio App",
      tag: "Flutter · Portfolio",
      description: "A cinematic personal brand hub with background video, animated avatars, and reactive transitions tailored for mobile storytelling.",
      image: "https://images.unsplash.com/photo-1580894896897-3ed498161c77?auto=format&fit=crop&w=1400&q=80",
      links: {
        code: "https://github.dev/RahulRakhi/Portpholiyo_app",
        live: "https://rajjourny.netlify.app/"
      },
      linkLabels: {
        code: "View Code",
        live: "Explore"
      }
    },
    {
      id: 3,
      title: "Media Capture Suite",
      tag: "Full Stack · Media",
      description: "Responsive media application combining intuitive capture tools, content management, and streaming-ready delivery pipelines.",
      image: "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=1400&q=80",
      links: {
        code: "https://github.com/RahulRakhi/Meadia_webapp",
        live: "https://mediacameraapp.netlify.app/"
      },
      linkLabels: {
        code: "View Code",
        live: "Live Demo"
      }
    },
    {
      id: 4,
      title: "PG Price Predictor",
      tag: "AI · Predictive",
      description: "Streamlit-powered analytics app forecasting rental trends with intuitive visual dashboards and explainable ML insights.",
      image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80",
      links: {
        code: "https://github.com/RahulRakhi/MlProjects/tree/PG-Price-Predect",
        live: "https://mlprojects-dxxnd5kkpytnwnsa4mlpmc.streamlit.app/"
      },
      linkLabels: {
        code: "View Code",
        live: "Live Demo"
      }
    }
  ],

  // Collections (Organized by Category)
  collections: [
    {
      category: "Flutter Projects",
      subcategories: [
        {
          name: "Mobile Applications",
          projects: [
            {
              title: "Flutter Ludo Game",
              description: "Built with Flutter and Audio library and use of linked list structures.",
              links: {
                code: "https://github.com/RahulRakhi/Ludo_Game",
                live: "https://ludocartoon.netlify.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Play Now"
              }
            },
            {
              title: "Flutter Portfolio App",
              description: "Personal portfolio mobile app with background video and animated avatar.",
              links: {
                code: "https://github.dev/RahulRakhi/Portpholiyo_app",
                live: "https://rajjourny.netlify.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Explore"
              }
            },
            {
              title: "Flutter Welding App",
              description: "Industrial-focused Flutter app with immersive UI and media integration.",
              links: {
                code: "https://github.com/RahulRakhi/welding1/tree/MainRaj",
                live: "https://weldingprojects.netlify.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Explore"
              }
            },
            {
              title: "Flutter Login UI",
              description: "Modern authentication experiences using Flutter and Dart.",
              links: {
                code: "https://github.dev/RahulRakhi/library_pro/tree/MainPro",
                live: "https://libraryje.netlify.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            }
          ]
        }
      ]
    },
    {
      category: "Full Stack Projects",
      subcategories: [
        {
          name: "Web Applications",
          projects: [
            {
              title: "Full Stack MediaApp",
              description: "Responsive portfolio with HTML, CSS, JS and multi-device capture flows.",
              links: {
                code: "https://github.com/RahulRakhi/Meadia_webapp",
                live: "https://mediacameraapp.netlify.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            },
            {
              title: "Full Stack Collection",
              description: "Suite of 10+ projects exploring authentication, dashboards, and automation.",
              links: {
                code: "https://github.com/RahulRakhi/fullstack"
              },
              linkLabels: {
                code: "View Code"
              }
            }
          ]
        }
      ]
    },
    {
      category: "AI & ML Projects",
      subcategories: [
        {
          name: "Linear Regression & Predictive Analytics",
          projects: [
            {
              title: "Linear Regression",
              description: "Conversational AI using OpenAI GPT API and interactive Streamlit apps.",
              links: {
                code: "https://github.dev/RahulRakhi/MlProjects/tree/main",
                live: "https://linearregrationp1.streamlit.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            },
            {
              title: "Project 2",
              description: "Exploratory analytics with Streamlit, pandas, and matplotlib visualizations.",
              links: {
                code: "https://github.com/RahulRakhi/MlProjects/tree/project1",
                live: "https://mlprojects-jmvrauhuxht8ysjag2g8kg.streamlit.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            },
            {
              title: "Mark Predict",
              description: "ML project predicting marks based on study hours using regression models.",
              links: {
                code: "https://github.com/RahulRakhi/MlProjects/tree/marksPredict",
                live: "https://mlprojects-whstruckbegfvgsol3pza3.streamlit.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            },
            {
              title: "PG Price Predict",
              description: "Predict housing prices with explainable ML and intuitive charts.",
              links: {
                code: "https://github.com/RahulRakhi/MlProjects/tree/PG-Price-Predect",
                live: "https://mlprojects-dxxnd5kkpytnwnsa4mlpmc.streamlit.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            },
            {
              title: "Electricity Price Predict",
              description: "Forecast energy pricing with dataset-driven training and interpretability.",
              links: {
                code: "https://github.com/RahulRakhi/MlProjects/tree/Electricty-Bill-Predict",
                live: "https://mlprojects-pckely3k96snrwuyyrhhfs.streamlit.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            }
          ]
        }
      ]
    },
    {
      category: "DevOps & Automation",
      subcategories: [
        {
          name: "DevOps Projects",
          projects: [
            {
              title: "Docker Command List",
              description: "Interactive reference for Docker commands and practical workflows.",
              links: {
                code: "https://github.com/RahulRakhi/DevOPs/tree/main",
                live: "https://devops-kp2gsdgbpkdhbc7jdkw3no.streamlit.app/"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            },
            {
              title: "Cloud Automation Script",
              description: "Shell + Python script to auto-deploy web apps on AWS.",
              links: {
                code: "https://github.com/rahulsain-tech/cloud-deploy",
                live: "#"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            }
          ]
        }
      ]
    },
    {
      category: "AI & Gen AI",
      subcategories: [
        {
          name: "Conversational AI",
          projects: [
            {
              title: "Gen AI Chatbot",
              description: "Conversational AI using OpenAI GPT API integrated with a modern UI.",
              links: {
                code: "https://github.com/rahulsain-tech/genai-chatbot",
                live: "https://chatbot-demo.netlify.app"
              },
              linkLabels: {
                code: "View Code",
                live: "Live Demo"
              }
            },
            {
              title: "AI & Gen AI Showcase",
              description: "Curated portfolio of AI-powered Flutter experiences and prototypes.",
              links: {
                code: "https://github.dev/RahulRakhi/Portpholiyo_app"
              },
              linkLabels: {
                code: "Explore"
              }
            }
          ]
        }
      ]
    }
  ],

  // Gallery Items
  gallery: [
    {
      title: "Mobile Experiences",
      description: "Snapshots from Flutter builds featuring animation layers, dynamic avatars, and engaging play."
    },
    {
      title: "Dashboards & Analytics",
      description: "Interactive web dashboards showcasing predictive analytics, real-time insights, and automation."
    },
    {
      title: "DevOps Visuals",
      description: "Visual documentation of deployment pipelines, automation scripts, and collaborative tooling."
    },
    {
      title: "AI Interfaces",
      description: "Generative AI chat experiences and experiment sandboxes built for intuitive human feedback."
    }
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = projectsData;
}

