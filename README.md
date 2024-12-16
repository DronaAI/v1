# Drona AI - AI-Powered Personalized Education Platform

**Drona AI** is an AI-driven educational platform inspired by the teachings of Dronacharya. It offers personalized learning paths, quizzes, and mentorship, making quality education accessible to everyone. By leveraging AI, we provide tailored learning experiences, doubt resolution, and progress tracking in a structured and engaging way.

## Features

- **AI-Powered Learning Paths**: Automatically curate structured YouTube playlists for any topic or subtopic, helping learners find the best resources.
- **Language No Bar**: Multilingual support using AI-powered natural language processing (NLP) to ensure users can learn in their preferred language.
- **Dynamic Quiz Generation**: AI-generated quizzes based on learning material to test your knowledge and reinforce learning.
- **Personalized Chatbot for Doubt Resolution**: Get instant answers to questions using our AI chatbot, powered by the OpenAI API.
- **Progress Tracking**: Monitor your learning journey with personalized analytics to identify strengths and areas for improvement.
- **Gamification**: Earn badges, build learning streaks, and see your progress on leaderboards to keep you motivated.

## **Vertex AI Integration**

Drona AI leverages **Google Vertex AI** to deliver advanced, AI-powered functionalities for creating dynamic and personalized learning experiences. Here's how we're using Vertex AI:

- **Course and Chapter Generation**: Using **Vertex AI Gemini**, Drona AI generates customized chapters for each topic, tailoring the content structure to individual learner needs.
- **Weakness Detection and Adaptive Learning**: With **Vertex AI RAG (Retrieval-Augmented Generation)**, we analyze quiz results to identify weak areas and generate new chapters or additional resources dynamically.
- **Multimedia Enhancement**: **Vertex AI ImaGen** is used to create engaging course thumbnails, adding a professional and personalized touch to the platform.
- **Performance Optimization**: Vertex AI’s scalable models ensure efficient handling of large-scale data for user performance tracking and analytics.

These integrations ensure a seamless, adaptive, and impactful learning experience for users, making Drona AI a robust and cutting-edge educational platform.

## Tech Stack

- 🌐 **Leveraging NextJS 13's cutting-edge App Router**: Enjoy the benefits of Next.js' latest features for optimized performance and routing.
- 💳 **Managing Payments seamlessly through Stripe**: Integrated payment system to handle user subscriptions and monetization.
- 🎨 **Harnessing the beauty of ShadCN and the power of Tailwind CSS**: Create beautiful and responsive UIs with custom component design and utility-first CSS.
- 🧠 **Unleashing the capabilities of OpenAI's API**: For advanced language model usage, powering the quiz generation and chatbot features.
- 🗃️ **Interacting with databases with the efficiency of ORMs**: Use the flexibility of ORMs to manage database interactions for user data, progress, and quizzes.
- 🚀 **Self-hosting on DigitalOcean**: Host the entire platform on DigitalOcean, ensuring high availability and scalable performance.
- 🔒 **Securing your deployment with a custom domain and SSL certificate**: Ensure secure access with HTTPS using a custom domain and SSL certification.
- 🔄 **Implementing a robust CI/CD pipeline with GitHub Actions**: Automate deployment processes and maintain high-quality code with continuous integration and delivery.

## Getting Started

### Prerequisites

- **Node.js** and **npm** installed on your machine.
- API keys for **YouTube**, **OpenAI**, **Vertex AI**, **Unsplash**, **NextAuth**, and **Stripe** credentials.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/drona-ai.git
   cd drona-ai
