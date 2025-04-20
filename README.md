# DronaAI

**AI‑Driven Adaptive Learning Platform**

DronaAI leverages a modular, multi‑agent architecture to deliver deeply personalized learning journeys. Each learner is supported by a suite of AI agents that collaboratively generate, curate, assess and adapt content in real‑time—replicating the dynamics of a one‑on‑one tutor at scale.

---

## 🚀 Key Highlights

- **Modular Multi‑Agent System**  
  - **CourseGenerationAgent**: Crafts structured syllabi and learning paths via LLM prompts.  
  - **ContentCurationAgent**: Aggregates and filters multimedia (video, text, interactive) using YouTube API, web‑scraping and LangChain pipelines.  
  - **AssessmentAgent**: Auto‑generates quizzes & flashcards; monitors performance.  
  - **FeedbackAgent**: Runs RAG‑augmented gap analysis (Vertex RAG / Pinecone) to detect misunderstandings and triggers adaptive content expansion.  
  - **ProfileAgent**: Maintains learner model—tracks skills, preferences, pacing.

- **Retrieval‑Augmented Generation (RAG)**  
  Embedding‑based context retrieval ensures agents reference up‑to‑date notes, transcripts and external resources for highly relevant explanations.

- **Scalable Backend**  
  Built with Next.js, React, Prisma ORM and MySQL on GCP; orchestrated via Docker, GitHub Actions and Vercel citeturn0file0.

---

## 🏗️ Architecture Overview
![DronaAI-Architecture](https://github.com/user-attachments/assets/b3d35137-a0bb-41b2-9b5d-c266be86275b)
![dronaai-flow-diagram](https://github.com/user-attachments/assets/39927d29-df75-4ff4-9f4d-ea90a11d0b4a)

## Analysis and Audit
<img width="943" alt="Screenshot 2025-04-20 at 6 49 23 PM" src="https://github.com/user-attachments/assets/3df6dca4-a82a-4c07-aef7-8775fcb05165" />


---

## 🔮 Roadmap & Blockchain Integration

1. **Verifiable On‑Chain Credentials**  
   - Mint learner achievements as NFTs (e.g., ERC‑721).  
   - Immutable proof of course completion and skill badges.

2. **Tokenized Incentives**  
   - Platform token to reward learners, peer tutors and content contributors.  
   - Micropayments for premium content via payment channels (DeFi rails).

3. **Decentralized Content Curation**  
   - DAO‑driven governance for ranking and approving new course modules.  
   - Community‑voted curriculum enhancements.

4. **DePIN for Content Delivery**  
   - Leverage decentralized infrastructure (e.g., IPFS + libp2p) to cache and serve video/text at the network edge.

### ✨ Benefits

- **Transparency & Trust**: On‑chain credentials eliminate fraud.  
- **Learner Ownership**: Users retain sovereignty over their learning records.  
- **Aligned Incentives**: Tokens foster active participation and high‑quality contributions.  
- **Resilient Scalability**: Distributed delivery reduces central bottlenecks.


Feel free to adjust diagrams, agent names or storage backends to match your implementation details.
