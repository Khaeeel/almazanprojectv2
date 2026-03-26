export const config = {
    developer: {
        name: "Dominic Boy",
        fullName: "Dominic Boy Almazan",
        title: "AI/Machine Learning Engineer",
        description: "Aspiring AI and Machine Learning engineer passionate about building intelligent, data-driven systems that transform complex problems into practical solutions through thoughtful design and robust engineering."
    },
    social: {
        github: "Khaeeel",
        email: "dmncalmzn@gmail.com",
        location: "Philippines"
    },
    about: {
        title: "About Me",
        description: "I'm a graduating IT student passionate about AI and Machine Learning. I build intelligent systems using predictive models, NLP, OCR, and LLMs to solve real-world problems. My experience spans machine learning development, full-stack backend engineering with Laravel, and creating data-driven solutions that transform raw data into meaningful insights."
    },
    experiences: [
        {
            position: "AI Intern",
            company: "Cornersteel Systems Corporation",
            period: "2024 - Present",
            location: "Philippines",
            description: "Developing AI-powered automation systems using advanced NLP and OCR technologies. Working on Synopsis project - an intelligent chatbot system that captures, analyzes, and summarizes conversations using multi-engine OCR, LLMs, and RAG systems for knowledge management.",
            responsibilities: [
                "Building OCR and LLM-based automation with EasyOCR and PaddleOCR",
                "Implementing RAG systems with ChromaDB for intelligent knowledge management",
                "Developing conversation analysis and summarization pipelines",
                "Creating REST APIs with Python Flask for backend services",
                "Integrating NLP models for text extraction and processing"
            ],
            technologies: ["Python", "OCR", "LLM", "RAG", "ChromaDB", "Flask", "NLP", "Docker"]
        },
        {
            position: "Full-Stack Developer",
            company: "Barangay Health Project",
            period: "2024",
            location: "Philippines",
            description: "Developed a comprehensive health management system with integrated machine learning for disease outbreak prediction at Barangay Daang Bakal Health Center.",
            responsibilities: [
                "Built full-stack Laravel PHP application with database optimization",
                "Implemented Random Forest, XGBoost, and Decision Tree ML algorithms",
                "Created patient records management and analytics dashboards",
                "Designed predictive visualization for health trends and case forecasting",
                "Integrated data analytics and reporting systems"
            ],
            technologies: ["Laravel", "PHP", "MySQL", "Random Forest", "XGBoost", "Data Analytics"]
        },
        {
            position: "NLP & AI Researcher",
            company: "University Research Projects",
            period: "2023 - 2024",
            location: "Philippines",
            description: "Conducted research and development in Natural Language Processing, including sentiment analysis, named entity recognition, and fine-tuned transformer models.",
            responsibilities: [
                "Fine-tuning MentalBERT with optimized hyperparameters (Grid & Random Search)",
                "Implementing sentiment classification for mental health text analysis",
                "Developing Named Entity Recognition models using spaCy",
                "Building BERT-based question answering systems",
                "Conducting comprehensive model evaluation and comparison studies"
            ],
            technologies: ["BERT", "Transformers", "PyTorch", "spaCy", "NLP", "Scikit-learn"]
        },
        {
            position: "Graphic Designer",
            company: "University Events",
            period: "2022 - 2024",
            location: "Philippines",
            description: "Designed professional vector-based graphics and posters for marketing materials, social media, branding, and institutional events, and served as a graphic designer for the JRU Pep Squad, producing visual content for performances and promotions.",
            responsibilities: [
                "Creating vector-based designs including logos and brand identity systems",
                "Designing social media graphics and promotional materials",
                "Producing posters and visual content for events, including JRU Pep Squad performances",
                "Developing digital marketing and branding content",
                "Applying strong art direction, layout, and visual composition principles"
            ],
            technologies: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Canva"]
        },

    ],
    projects: [
        {
            id: 1,
            title: "Predictive Analytics - Barangay Daang Bakal Health Center",
            category: "Full Stack / ML",
            technologies: "Laravel, PHP, Machine Learning, Random Forest, XGBoost, MySQL",
            image: "/images/barangay-health/dashboard.png",
            github: "https://github.com/Khaeeel/AssembleAfterRevision",
            description: "Full-stack Laravel PHP application with integrated machine learning for disease outbreak prediction. Implements Random Forest, XGBoost, and Decision Tree algorithms to analyze patient health records and predict health trends."
        },
        {
            id: 2,
            title: "Synopsis: Automated Viber Chat Summarizer",
            category: "AI / Automation",
            technologies: "Python, Next.js, OCR, LLM, ChromaDB, MySQL, RAG, Docker",
            image: "/images/placeholder.webp",
            github: "https://github.com/Khaeeel/Sypnosis_Project_Full",
            description: "AI-powered system that captures and analyzes Viber chat conversations using multi-engine OCR and LLMs. Automatically extracts tasks, generates forensic reports, builds a searchable knowledge base using RAG."
        },
        {
            id: 3,
            title: "Stroke Prediction",
            category: "Machine Learning",
            technologies: "Python, Pandas, Scikit-learn, Data Analysis",
            image: "/COVER/strokecover.png",
            workImage: "/projects/STROKE.png",
            github: "https://github.com/Khaeeel/Project-ML-and-AI/tree/main/Machine%20Learning/Stroke%20Prediction",
            description: "Compares multiple classifiers for medical diagnostics, identifying Support Vector Machine (SVM) as the most accurate model with 97.15% test accuracy, followed by K-Nearest Neighbors at 96.66%."
        },
        {
            id: 4,
            title: "MentalBert",
            category: "NLP / Deep Learning",
            technologies: "BERT, Transformers, PyTorch, NLP, Fine-tuning",
            image: "/COVER/mentalbertcover.png",
            workImage: "/projects/mentalbert.png",
            github: "https://github.com/Khaeeel/Project-ML-and-AI/tree/main/MentalBert",
            description: "Fine-tuning MentalBERT with optimized hyperparameters (Grid and Random Search) significantly improves reliability, achieving 0.98 accuracy and 0.975 F1-score."
        },
        {
            id: 5,
            title: "Sentiment Analysis",
            category: "NLP",
            technologies: "NLP, Scikit-learn, Python, Text Analysis, Hugging Face",
            image: "/COVER/SentimentCOVER.png",
            workImage: "/projects/Sentiment Analysis.png",
            github: "https://github.com/Khaeeel/Project-ML-and-AI/tree/main/Sentiment%20Analysis",
            description: "Sentiment Classification in Mental Health Texts. Achieved F1-score of 0.983 in detecting suicidal ideation within social media text through systematic hyperparameter tuning."
        },
        {
            id: 6,
            title: "Named Entity Recognition (NER)",
            category: "NLP",
            technologies: "spaCy, NLP, Python, Information Extraction",
            image: "/COVER/NERcover.png",
            github: "https://github.com/Khaeeel/Project-ML-and-AI/tree/main/Name%20Entity%20Recognition%20(%20NER%20)",
            description: "Evaluation of spaCy's NER models across news articles revealing similar accuracy (~0.81) across model sizes, suggesting smaller models are more efficient for domain-specific tasks."
        },
        {
            id: 7,
            title: "BERT Question & Answer",
            category: "NLP / Deep Learning",
            technologies: "BERT, Transformers, PyTorch, NLP",
            image: "/COVER/BERTCOVER.png",
            github: "https://github.com/Khaeeel/Project-ML-and-AI/tree/main/BERT%20-%20QnA",
            description: "Pre-trained BERT model fine-tuned for extractive question-answering tasks with high accuracy on reading comprehension datasets."
        },
        {
            id: 8,
            title: "Multi-Layer Perceptron (MLP)",
            category: "Deep Learning",
            technologies: "TensorFlow, Neural Networks, Keras, Python",
            image: "/COVER/mlpcover.png",
            github: "https://github.com/Khaeeel/Project-ML-and-AI/tree/main/MLP",
            description: "Explores Multi-Layer Perceptrons for educational resource planning achieving peak testing accuracy of 96.48% after rigorous data preprocessing and refinement."
        },
        {
            id: 9,
            title: "Graphic Design Portfolio",
            category: "Design",
            technologies: "Adobe Photoshop, Adobe Illustrator, Figma, Canva",
            image: "/images/gp/art1.jpg",
            github: "#",
            description: "Professional graphic design projects showcasing expertise in visual design, branding, logo design, UI/UX, and creative composition for events and marketing materials."
        }
    ],
    contact: {
        email: "dmncalmzn@gmail.com",
        github: "https://github.com/Khaeeel",
        linkedin: "https://www.linkedin.com/in/dominic-almazan-58b387397/",
        facebook: "https://www.facebook.com/dominicalmazan77/"
    },
    certificates: [
        {
            title: 'AI-For-Good Students',
            issuer: 'AI SINGAPORE',
            description: 'Awarded for active participation and accomplishments in the AI-For-Good Students Program by AI Singapore, promoting the use of artificial intelligence for social good.',
            image: '/images/Certificates/AI-For-Good-Studenudents_Almazan-Dominic.jpg',
        },
        {
            title: 'PSITE-STUDENT CONGRESS 2026: From code to Confidence',
            issuer: 'Security and AI for the next generation of computing students',
            description: 'Recognized for participating in the PSITE Student Congress 2026: From Code to Confidence, highlighting developments in cybersecurity and artificial intelligence in modern computing education.',
            image: '/images/Certificates/Dominic_Boy_P__Almazan_69a4c8bca457d35eca6259a0_page-0001.jpg',
        },
    ],
    skills: {
        develop: {
            title: "AI/ML DEVELOPER",
            description: "Building intelligent data-driven systems",
            details: "Developing machine learning models, predictive analytics systems, and AI-powered automation. Specializing in NLP, LLMs, RAG systems, OCR, and data processing with practical real-world applications.",
            tools: ["Python", "Machine Learning", "Predictive Analytics", "NLP / LLM", "RAG", "ChromaDB", "OCR", "Data Processing"]
        },
        design: {
            title: "FULL-STACK",
            description: "Building end-to-end solutions",
            details: "Developing full-stack applications combining backend systems (Laravel, Flask, Python), databases (MySQL), and frontend interfaces. Creating REST APIs, analytics dashboards, and integrated AI solutions.",
            tools: ["Python", "JavaScript", "React", "Next.js", "Flask", "Laravel", "PHP", "MySQL", "REST APIs", "Git"]
        },
        tools: {
            title: "DESIGN & TOOLS",
            description: "Supporting creative and development workflow",
            details: "Using industry-standard tools for design, version control, and collaboration. Skilled in UI/UX design, data visualization, and modern development tools.",
            tools: ["Figma", "Adobe Photoshop", "Git / GitHub", "Canva", "MS Office", "Mapbox GL JS"]
        }
    }
};


