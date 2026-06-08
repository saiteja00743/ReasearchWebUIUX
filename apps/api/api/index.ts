/**
 * ResearchHub API — Vercel Serverless Handler (Demo / Showcase Mode)
 *
 * This is a fully self-contained Express handler designed for Vercel deployment.
 * It uses rich in-memory demo data so the showcase works with zero external services
 * (no MongoDB, no Redis, no Cloudinary required).
 *
 * All routes match the production API shape exactly so the frontend works unchanged.
 */

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// ─── JWT Demo Secret (fallback when env vars not set) ────────────────────────
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "researchhub-demo-access-secret-2024";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "researchhub-demo-refresh-secret-2024";
const APP_URL = process.env.APP_URL ?? "https://researchhub.vercel.app";

// ─── Demo Seed Data ───────────────────────────────────────────────────────────

const DEMO_USERS: DemoUser[] = [
  {
    id: "usr_001",
    name: "Arjun Mehta",
    username: "arjunmehta",
    email: "arjun@demo.researchhub.app",
    passwordHash: crypto.createHash("sha256").update("Demo@1234").digest("hex"),
    role: "student",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    university: "IIT Bombay",
    bio: "Final year CS student passionate about Machine Learning and Distributed Systems. Published 3 research papers in top-tier conferences.",
    skills: ["Python", "TensorFlow", "PyTorch", "Distributed Systems", "NLP"],
    socialLinks: [
      { label: "GitHub", url: "https://github.com/arjunmehta" },
      { label: "LinkedIn", url: "https://linkedin.com/in/arjunmehta" }
    ],
    followers: 284,
    following: 67,
    createdAt: "2023-08-15T10:30:00Z",
    lastLoginAt: new Date().toISOString()
  },
  {
    id: "usr_002",
    name: "Priya Sharma",
    username: "priyasharma",
    email: "priya@demo.researchhub.app",
    passwordHash: crypto.createHash("sha256").update("Demo@1234").digest("hex"),
    role: "reviewer",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    university: "IISc Bangalore",
    bio: "PhD candidate in Computational Biology. Reviewer for Nature Biomedical Engineering. Interested in AI-driven drug discovery.",
    skills: ["Bioinformatics", "Deep Learning", "R", "CRISPR Analysis", "Protein Folding"],
    socialLinks: [
      { label: "Google Scholar", url: "https://scholar.google.com" },
      { label: "Twitter", url: "https://twitter.com/priyasharma" }
    ],
    followers: 512,
    following: 134,
    createdAt: "2023-06-01T08:00:00Z",
    lastLoginAt: new Date().toISOString()
  },
  {
    id: "usr_003",
    name: "Rohan Verma",
    username: "rohanverma",
    email: "rohan@demo.researchhub.app",
    passwordHash: crypto.createHash("sha256").update("Demo@1234").digest("hex"),
    role: "student",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    university: "NIT Trichy",
    bio: "3rd year undergrad exploring Quantum Computing and Cryptography. TEDx speaker. Building open-source tools for researchers.",
    skills: ["Qiskit", "Cryptography", "C++", "Rust", "Quantum Algorithms"],
    socialLinks: [
      { label: "GitHub", url: "https://github.com/rohanverma" }
    ],
    followers: 138,
    following: 45,
    createdAt: "2024-01-10T12:00:00Z",
    lastLoginAt: new Date().toISOString()
  },
  {
    id: "usr_004",
    name: "Sneha Kapoor",
    username: "snehakapoor",
    email: "sneha@demo.researchhub.app",
    passwordHash: crypto.createHash("sha256").update("Demo@1234").digest("hex"),
    role: "student",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    university: "BITS Pilani",
    bio: "Data Science and Economics double major. Working on AI fairness and bias detection in financial models.",
    skills: ["Python", "Pandas", "Fairness ML", "Economics", "Data Visualization"],
    socialLinks: [
      { label: "LinkedIn", url: "https://linkedin.com/in/snehakapoor" }
    ],
    followers: 97,
    following: 203,
    createdAt: "2024-03-20T09:15:00Z",
    lastLoginAt: new Date().toISOString()
  },
  {
    id: "usr_admin",
    name: "Admin User",
    username: "admin",
    email: "admin@demo.researchhub.app",
    passwordHash: crypto.createHash("sha256").update("Admin@1234").digest("hex"),
    role: "admin",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    university: "ResearchHub HQ",
    bio: "Platform administrator.",
    skills: [],
    socialLinks: [],
    followers: 0,
    following: 0,
    createdAt: "2023-01-01T00:00:00Z",
    lastLoginAt: new Date().toISOString()
  }
];

const DEMO_PUBLICATIONS: DemoPublication[] = [
  {
    id: "pub_001",
    title: "Attention Is All You Need: A Deep Dive into Transformer Architectures for Low-Resource NLP Tasks",
    slug: "attention-is-all-you-need-low-resource-nlp-ax7k2p",
    abstract: "Transformer architectures have revolutionized natural language processing, yet their performance on low-resource languages remains an open challenge. This paper presents a systematic study of attention mechanisms in transformer models when applied to languages with fewer than 100,000 training samples. We propose AdaptiveSparse Attention (ASA), a novel mechanism that dynamically adjusts attention sparsity based on input complexity. Experiments across 14 low-resource languages demonstrate that ASA achieves state-of-the-art performance, improving F1 scores by an average of 7.3% over baseline transformers while reducing computational cost by 34%.",
    summary: "We introduce AdaptiveSparse Attention (ASA) for low-resource NLP, achieving 7.3% F1 improvement across 14 languages with 34% less compute.",
    keywords: ["transformer", "attention mechanism", "low-resource NLP", "natural language processing", "deep learning"],
    tags: ["NLP", "Transformers", "Low-Resource", "AI"],
    category: "computer-science",
    authors: [
      { name: "Arjun Mehta", email: "arjun@iitb.ac.in", affiliation: "IIT Bombay" },
      { name: "Dr. Vikram Nair", email: "vnair@iitb.ac.in", affiliation: "IIT Bombay" }
    ],
    owner: publicUser(DEMO_USERS[0]),
    pdfUrl: "https://arxiv.org/pdf/1706.03762",
    coverImageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop",
    citation: "Mehta, A., Nair, V. (2024). Attention Is All You Need: A Deep Dive into Transformer Architectures for Low-Resource NLP Tasks. ResearchHub. " + APP_URL + "/publication/attention-is-all-you-need-low-resource-nlp-ax7k2p",
    status: "published",
    metrics: { views: 4821, downloads: 1203, likes: 387, bookmarks: 214, shares: 89 },
    publishedAt: "2024-02-14T10:00:00Z",
    createdAt: "2024-01-20T09:30:00Z",
    updatedAt: "2024-02-14T10:00:00Z"
  },
  {
    id: "pub_002",
    title: "CRISPR-Guided Protein Folding Prediction Using Graph Neural Networks: Towards AI-Driven Drug Discovery",
    slug: "crispr-protein-folding-gnn-drug-discovery-mq9r1z",
    abstract: "The intersection of CRISPR gene editing and computational protein structure prediction represents a frontier in personalized medicine. We present CRISPRFold-GNN, a graph neural network architecture that integrates CRISPR guide RNA sequences with protein topology data to predict structural changes induced by gene edits. Validated against 2,300 experimentally confirmed CRISPR edits from the GenomicsDB repository, our model achieves 91.4% accuracy in predicting secondary structure perturbations, outperforming AlphaFold2 fine-tuned baselines by 6.8%. This work opens pathways for in-silico pre-screening of CRISPR therapeutics, reducing wet lab iterations by an estimated 40%.",
    summary: "CRISPRFold-GNN predicts protein structural changes from CRISPR edits with 91.4% accuracy, outperforming AlphaFold2 baselines by 6.8%.",
    keywords: ["CRISPR", "protein folding", "graph neural network", "drug discovery", "bioinformatics"],
    tags: ["Biotech", "AI", "CRISPR", "Drug Discovery"],
    category: "biotechnology",
    authors: [
      { name: "Priya Sharma", email: "priya@iisc.ac.in", affiliation: "IISc Bangalore" },
      { name: "Dr. Ananya Iyer", email: "aiyer@iisc.ac.in", affiliation: "IISc Bangalore" }
    ],
    owner: publicUser(DEMO_USERS[1]),
    pdfUrl: "https://www.nature.com/articles/s41587-021-01094-0",
    coverImageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=400&fit=crop",
    citation: "Sharma, P., Iyer, A. (2024). CRISPR-Guided Protein Folding Prediction Using Graph Neural Networks. ResearchHub.",
    status: "published",
    metrics: { views: 6342, downloads: 2108, likes: 521, bookmarks: 308, shares: 142 },
    publishedAt: "2024-01-28T08:00:00Z",
    createdAt: "2023-12-05T11:00:00Z",
    updatedAt: "2024-01-28T08:00:00Z"
  },
  {
    id: "pub_003",
    title: "Quantum-Resistant Cryptographic Protocols for Internet of Things: A Post-Quantum Security Framework",
    slug: "quantum-resistant-cryptography-iot-post-quantum-zp4m8n",
    abstract: "With the imminent arrival of practical quantum computers, existing RSA and ECC-based cryptographic schemes protecting IoT devices face existential threats. This paper proposes QuantumShield, a lightweight post-quantum cryptographic framework tailored for resource-constrained IoT devices. QuantumShield integrates CRYSTALS-Kyber for key encapsulation and CRYSTALS-Dilithium for digital signatures, optimized through a custom hardware abstraction layer that reduces memory overhead by 58% compared to naïve NIST PQC implementations. We benchmark QuantumShield on 12 representative IoT platforms (ARM Cortex-M0 to M33), demonstrating sub-10ms handshake latency even on the most constrained hardware.",
    summary: "QuantumShield is a post-quantum cryptographic framework for IoT that achieves sub-10ms handshake latency with 58% lower memory overhead.",
    keywords: ["post-quantum cryptography", "IoT security", "CRYSTALS-Kyber", "lattice-based cryptography", "embedded systems"],
    tags: ["Quantum", "IoT", "Cryptography", "Security"],
    category: "computer-science",
    authors: [
      { name: "Rohan Verma", email: "rohan@nit.ac.in", affiliation: "NIT Trichy" }
    ],
    owner: publicUser(DEMO_USERS[2]),
    pdfUrl: "https://eprint.iacr.org/2020/1616.pdf",
    coverImageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
    citation: "Verma, R. (2024). Quantum-Resistant Cryptographic Protocols for IoT. ResearchHub.",
    status: "published",
    metrics: { views: 3215, downloads: 876, likes: 243, bookmarks: 157, shares: 61 },
    publishedAt: "2024-03-05T14:00:00Z",
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-03-05T14:00:00Z"
  },
  {
    id: "pub_004",
    title: "Algorithmic Fairness in Credit Scoring: Detecting and Mitigating Intersectional Bias in Machine Learning Models",
    slug: "algorithmic-fairness-credit-scoring-intersectional-bias-wr3t6h",
    abstract: "Credit scoring algorithms powered by machine learning have demonstrated systematic bias against intersectional demographic groups — particularly affecting individuals at the intersection of race, gender, and socioeconomic status. This paper introduces FairScore, an auditing and debiasing framework that extends traditional fairness metrics (demographic parity, equalized odds) to intersectional subgroups. Applied to three major open-source credit datasets (German Credit, Taiwan Credit, and a proprietary synthetic dataset), FairScore reduces intersectional disparity by 72% while maintaining predictive accuracy within 2.1% of biased baseline models. Our findings have direct policy implications for financial regulators.",
    summary: "FairScore reduces intersectional bias in credit scoring models by 72% with only 2.1% accuracy trade-off, using novel intersectional fairness metrics.",
    keywords: ["algorithmic fairness", "credit scoring", "intersectional bias", "machine learning", "financial AI"],
    tags: ["Fairness", "Finance", "ML", "Ethics"],
    category: "data-science",
    authors: [
      { name: "Sneha Kapoor", email: "sneha@bits.ac.in", affiliation: "BITS Pilani" }
    ],
    owner: publicUser(DEMO_USERS[3]),
    pdfUrl: "https://arxiv.org/pdf/2012.02447",
    coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    citation: "Kapoor, S. (2024). Algorithmic Fairness in Credit Scoring. ResearchHub.",
    status: "published",
    metrics: { views: 2847, downloads: 734, likes: 198, bookmarks: 124, shares: 47 },
    publishedAt: "2024-04-12T11:00:00Z",
    createdAt: "2024-03-18T09:00:00Z",
    updatedAt: "2024-04-12T11:00:00Z"
  },
  {
    id: "pub_005",
    title: "Federated Learning Under Heterogeneous Data Distributions: A Communication-Efficient Aggregation Strategy",
    slug: "federated-learning-heterogeneous-data-communication-efficient-kd5j9q",
    abstract: "Federated learning enables collaborative model training without centralizing sensitive data, but suffers severe performance degradation under non-IID data distributions across clients. We present FedHetAgg, a novel aggregation strategy that uses gradient diversity scores to adaptively weight client updates, significantly improving convergence under extreme data heterogeneity. Evaluated on CIFAR-10, CIFAR-100, and a medical imaging dataset (CheXpert), FedHetAgg converges 2.3× faster than FedAvg and achieves 4.1% higher accuracy on non-IID splits while reducing communication rounds by 41%. This work is particularly relevant for healthcare and finance applications where data silos are regulatory requirements.",
    summary: "FedHetAgg aggregation strategy improves federated learning convergence 2.3× over FedAvg with 41% fewer communication rounds on non-IID data.",
    keywords: ["federated learning", "non-IID data", "gradient aggregation", "privacy-preserving ML", "distributed learning"],
    tags: ["Federated Learning", "Privacy", "Distributed ML"],
    category: "computer-science",
    authors: [
      { name: "Arjun Mehta", email: "arjun@iitb.ac.in", affiliation: "IIT Bombay" },
      { name: "Dr. Pooja Rao", email: "prao@iitb.ac.in", affiliation: "IIT Bombay" }
    ],
    owner: publicUser(DEMO_USERS[0]),
    pdfUrl: "https://arxiv.org/pdf/2012.04235",
    coverImageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    citation: "Mehta, A., Rao, P. (2024). Federated Learning Under Heterogeneous Data Distributions. ResearchHub.",
    status: "published",
    metrics: { views: 3912, downloads: 1087, likes: 312, bookmarks: 189, shares: 73 },
    publishedAt: "2024-02-28T09:00:00Z",
    createdAt: "2024-01-30T10:00:00Z",
    updatedAt: "2024-02-28T09:00:00Z"
  },
  {
    id: "pub_006",
    title: "Neural Architecture Search for Energy-Efficient Edge Inference: A Multi-Objective Evolutionary Approach",
    slug: "neural-architecture-search-edge-inference-evolutionary-lp2x5w",
    abstract: "Deploying deep neural networks on edge devices requires balancing inference accuracy against strict energy and latency budgets. We propose EvoNAS-Edge, a multi-objective evolutionary neural architecture search framework that simultaneously optimizes for accuracy, energy consumption, and inference latency on edge hardware. Using a hierarchical chromosome encoding and Pareto-front selection, EvoNAS-Edge discovers architectures that achieve ImageNet top-1 accuracy within 1.2% of EfficientNet-B0 while consuming 67% less energy on NVIDIA Jetson Nano and 54% less on Raspberry Pi 4. The discovered architectures are fully transferable without fine-tuning.",
    summary: "EvoNAS-Edge discovers neural architectures with 67% lower energy consumption on edge hardware while maintaining accuracy within 1.2% of EfficientNet-B0.",
    keywords: ["neural architecture search", "edge computing", "energy efficiency", "evolutionary algorithms", "embedded AI"],
    tags: ["NAS", "Edge AI", "Embedded Systems", "Efficiency"],
    category: "computer-science",
    authors: [
      { name: "Rohan Verma", email: "rohan@nit.ac.in", affiliation: "NIT Trichy" },
      { name: "Dr. Karthik Subramanian", email: "ksubramanian@nit.ac.in", affiliation: "NIT Trichy" }
    ],
    owner: publicUser(DEMO_USERS[2]),
    pdfUrl: "https://arxiv.org/pdf/1907.04373",
    coverImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
    citation: "Verma, R., Subramanian, K. (2024). Neural Architecture Search for Energy-Efficient Edge Inference. ResearchHub.",
    status: "published",
    metrics: { views: 1823, downloads: 498, likes: 134, bookmarks: 87, shares: 29 },
    publishedAt: "2024-05-01T10:00:00Z",
    createdAt: "2024-04-01T08:00:00Z",
    updatedAt: "2024-05-01T10:00:00Z"
  },
  {
    id: "pub_007",
    title: "Single-Cell RNA Sequencing Analysis Pipeline for Tumor Microenvironment Characterization Using Self-Supervised Learning",
    slug: "scrna-seq-tumor-microenvironment-self-supervised-hn8v3c",
    abstract: "Characterizing the tumor microenvironment (TME) through single-cell RNA sequencing (scRNA-seq) is critical for understanding cancer immunology and designing effective immunotherapies. Traditional analysis pipelines rely heavily on curated marker genes and manual annotation, limiting scalability. We present scTME-SSL, a self-supervised learning pipeline that learns cell-type representations directly from raw count matrices without requiring labeled training data. Trained on 2.1 million cells from the CellxGene corpus, scTME-SSL achieves 94.2% clustering accuracy on held-out cancer datasets, correctly identifying 23 distinct TME cell populations including novel transitional states. Integration with spatial transcriptomics data reveals spatial TME organization patterns previously invisible to bulk-sequencing approaches.",
    summary: "scTME-SSL uses self-supervised learning on 2.1M cells to identify 23 distinct tumor microenvironment populations with 94.2% clustering accuracy.",
    keywords: ["single-cell RNA-seq", "tumor microenvironment", "self-supervised learning", "cancer immunology", "bioinformatics"],
    tags: ["Cancer Research", "Genomics", "Self-supervised Learning"],
    category: "biotechnology",
    authors: [
      { name: "Priya Sharma", email: "priya@iisc.ac.in", affiliation: "IISc Bangalore" }
    ],
    owner: publicUser(DEMO_USERS[1]),
    pdfUrl: "https://www.nature.com/articles/s41592-022-01601-4",
    coverImageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop",
    citation: "Sharma, P. (2024). Single-Cell RNA Sequencing Analysis Pipeline for Tumor Microenvironment Characterization. ResearchHub.",
    status: "published",
    metrics: { views: 5103, downloads: 1891, likes: 467, bookmarks: 281, shares: 118 },
    publishedAt: "2024-03-20T12:00:00Z",
    createdAt: "2024-02-14T09:00:00Z",
    updatedAt: "2024-03-20T12:00:00Z"
  },
  {
    id: "pub_008",
    title: "Large Language Models as Scientific Reviewers: Benchmarking GPT-4 and Claude Against Human Peer Review Quality",
    slug: "llm-scientific-reviewers-gpt4-claude-benchmark-ty6n1m",
    abstract: "The peer review bottleneck threatens the sustainability of academic publishing. This study presents the first systematic benchmark of large language models (LLMs) as scientific reviewers, comparing GPT-4-turbo, Claude 3 Opus, Gemini Ultra, and Llama-3-70B against 1,240 human reviews from NeurIPS 2023. We evaluate reviews on six dimensions: technical accuracy, constructiveness, coverage, specificity, fairness, and calibration. GPT-4-turbo achieves 78% agreement with human consensus accept/reject decisions (vs. 72% inter-reviewer human agreement), but shows significant deficit in identifying subtle methodological flaws (34% vs. 61% human detection rate). We propose a hybrid human-LLM review protocol that reduces reviewer load by 52% while maintaining review quality within 0.4 standard deviations of all-human baselines.",
    summary: "LLMs match 78% of human peer review accept/reject decisions but miss subtle flaws. A hybrid protocol reduces reviewer load 52% with minimal quality loss.",
    keywords: ["large language models", "peer review", "scientific publishing", "GPT-4", "academic AI"],
    tags: ["LLM", "Peer Review", "AI in Science", "Publishing"],
    category: "computer-science",
    authors: [
      { name: "Arjun Mehta", email: "arjun@iitb.ac.in", affiliation: "IIT Bombay" },
      { name: "Sneha Kapoor", email: "sneha@bits.ac.in", affiliation: "BITS Pilani" }
    ],
    owner: publicUser(DEMO_USERS[0]),
    pdfUrl: "https://arxiv.org/pdf/2310.01783",
    coverImageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
    citation: "Mehta, A., Kapoor, S. (2024). Large Language Models as Scientific Reviewers. ResearchHub.",
    status: "published",
    metrics: { views: 8934, downloads: 3421, likes: 712, bookmarks: 445, shares: 201 },
    publishedAt: "2024-04-05T09:00:00Z",
    createdAt: "2024-03-10T11:00:00Z",
    updatedAt: "2024-04-05T09:00:00Z"
  },
  {
    id: "pub_009",
    title: "Explainable AI for Clinical Decision Support: Counterfactual Explanations in Sepsis Prediction",
    slug: "explainable-ai-clinical-sepsis-prediction-counterfactual-bg4r7k",
    abstract: "Sepsis kills over 11 million people annually, yet early prediction models remain black boxes opaque to clinicians. We present SepsisXAI, a counterfactual explanation framework built on top of a gradient-boosted sepsis prediction model trained on 85,000 ICU admissions from the MIMIC-IV database. SepsisXAI generates actionable counterfactual interventions — e.g., 'reducing lactate by 1.2 mmol/L and starting vasopressors within 2 hours would reduce sepsis probability from 87% to 31%' — that align with established Surviving Sepsis Campaign guidelines. A clinical study with 47 ICU physicians shows SepsisXAI explanations are rated as clinically actionable in 83% of cases, vs. 21% for SHAP-based explanations.",
    summary: "SepsisXAI generates clinician-actionable counterfactual explanations for sepsis prediction, rated useful in 83% of cases vs. 21% for SHAP.",
    keywords: ["explainable AI", "sepsis prediction", "counterfactual explanations", "clinical decision support", "ICU"],
    tags: ["Healthcare AI", "XAI", "Clinical", "Sepsis"],
    category: "health-sciences",
    authors: [
      { name: "Priya Sharma", email: "priya@iisc.ac.in", affiliation: "IISc Bangalore" },
      { name: "Dr. Ramesh Gupta", email: "rgupta@aiims.ac.in", affiliation: "AIIMS New Delhi" }
    ],
    owner: publicUser(DEMO_USERS[1]),
    pdfUrl: "https://www.nejm.org/doi/full/10.1056/NEJMoa2034906",
    coverImageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop",
    citation: "Sharma, P., Gupta, R. (2024). Explainable AI for Clinical Decision Support: Sepsis Prediction. ResearchHub.",
    status: "published",
    metrics: { views: 4567, downloads: 1567, likes: 389, bookmarks: 234, shares: 98 },
    publishedAt: "2024-05-15T10:00:00Z",
    createdAt: "2024-04-20T09:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z"
  },
  {
    id: "pub_010",
    title: "Decentralized Autonomous Organizations for Academic Governance: A Blockchain-Based Peer Review Protocol",
    slug: "dao-academic-governance-blockchain-peer-review-xj2m4p",
    abstract: "Traditional academic publishing suffers from slow, opaque peer review processes, gatekeeping by established journals, and a replication crisis fueled by publication bias. We propose ResearchDAO, a decentralized autonomous organization protocol built on Ethereum that incentivizes high-quality peer review through token economics. Reviewers earn RSRCH tokens proportional to review quality (measured by subsequent citation metrics and community upvotes), which grant governance rights over publication standards and editorial decisions. A 6-month pilot with 340 participants across 3 universities processed 127 submissions, achieving median review turnaround of 8.3 days vs. 97 days industry average, with reviewer agreement kappa of 0.71 (substantial).",
    summary: "ResearchDAO uses blockchain token economics to incentivize peer review, achieving 8.3-day turnaround vs. 97-day industry average with substantial reviewer agreement.",
    keywords: ["decentralized autonomous organization", "blockchain", "peer review", "academic publishing", "token economics"],
    tags: ["Blockchain", "Web3", "Academic Publishing", "Decentralization"],
    category: "computer-science",
    authors: [
      { name: "Rohan Verma", email: "rohan@nit.ac.in", affiliation: "NIT Trichy" },
      { name: "Sneha Kapoor", email: "sneha@bits.ac.in", affiliation: "BITS Pilani" }
    ],
    owner: publicUser(DEMO_USERS[2]),
    pdfUrl: "https://arxiv.org/pdf/2301.09055",
    coverImageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    citation: "Verma, R., Kapoor, S. (2024). Decentralized Autonomous Organizations for Academic Governance. ResearchHub.",
    status: "published",
    metrics: { views: 2198, downloads: 614, likes: 178, bookmarks: 112, shares: 52 },
    publishedAt: "2024-06-01T10:00:00Z",
    createdAt: "2024-05-05T08:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z"
  },
  {
    id: "pub_011",
    title: "Climate Change Prediction Using Multi-Modal Satellite Imagery and Atmospheric Sensor Fusion with Vision Transformers",
    slug: "climate-change-prediction-multimodal-satellite-vision-transformer-qr7s2n",
    abstract: "Accurate short-term climate prediction requires fusing heterogeneous data sources including satellite imagery, ground sensor networks, ocean buoys, and atmospheric sounders. We present ClimateViT, a vision transformer architecture extended with a novel cross-modal attention mechanism that fuses 6 data modalities for 72-hour regional temperature, precipitation, and wind speed forecasting. Trained on 15 years of ERA5 reanalysis data and validated on 2023 holdout data, ClimateViT outperforms ECMWF's operational IFS model by 12% RMSE on temperature and 18% on precipitation at 50km resolution. Real-time inference runs in under 3 seconds on a single A100 GPU, enabling operational deployment.",
    summary: "ClimateViT fuses 6 satellite/sensor modalities using cross-modal vision transformers, outperforming ECMWF IFS by 12-18% RMSE for 72-hour regional forecasting.",
    keywords: ["climate prediction", "vision transformer", "satellite imagery", "sensor fusion", "weather forecasting"],
    tags: ["Climate", "Remote Sensing", "Vision Transformer", "Forecasting"],
    category: "environmental-science",
    authors: [
      { name: "Sneha Kapoor", email: "sneha@bits.ac.in", affiliation: "BITS Pilani" },
      { name: "Dr. Anil Bhatia", email: "abhatia@imd.gov.in", affiliation: "India Meteorological Department" }
    ],
    owner: publicUser(DEMO_USERS[3]),
    pdfUrl: "https://arxiv.org/pdf/2212.12794",
    coverImageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=400&fit=crop",
    citation: "Kapoor, S., Bhatia, A. (2024). Climate Change Prediction Using Multi-Modal Satellite Imagery. ResearchHub.",
    status: "published",
    metrics: { views: 3401, downloads: 987, likes: 267, bookmarks: 165, shares: 71 },
    publishedAt: "2024-05-28T11:00:00Z",
    createdAt: "2024-04-30T10:00:00Z",
    updatedAt: "2024-05-28T11:00:00Z"
  },
  {
    id: "pub_012",
    title: "Reinforcement Learning for Adaptive Curriculum Design in MOOCs: Personalizing Learning Paths at Scale",
    slug: "reinforcement-learning-adaptive-curriculum-mooc-personalization-fw5p3r",
    abstract: "Massive Open Online Courses (MOOCs) suffer from high dropout rates (up to 95%) partly due to one-size-fits-all content sequencing. We present EduRL, a reinforcement learning system that dynamically adapts learning path sequencing based on individual learner performance signals (quiz scores, engagement time, error patterns). Deployed in a 14-week machine learning MOOC on Coursera with 12,847 enrolled learners, EduRL reduces dropout rates from 71% to 43%, improves final assessment scores by 18.3%, and increases completion rates from 11% to 34%. The system uses a contextual multi-armed bandit formulation with Thompson Sampling, enabling real-time adaptation with sub-100ms latency.",
    summary: "EduRL uses reinforcement learning to personalize MOOC curriculum, reducing dropout from 71% to 43% and tripling completion rates in a real-world Coursera deployment.",
    keywords: ["reinforcement learning", "adaptive learning", "MOOC", "education technology", "personalization"],
    tags: ["EdTech", "RL", "Personalization", "MOOCs"],
    category: "education",
    authors: [
      { name: "Arjun Mehta", email: "arjun@iitb.ac.in", affiliation: "IIT Bombay" }
    ],
    owner: publicUser(DEMO_USERS[0]),
    pdfUrl: "https://arxiv.org/pdf/2102.04381",
    coverImageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop",
    citation: "Mehta, A. (2024). Reinforcement Learning for Adaptive Curriculum Design in MOOCs. ResearchHub.",
    status: "published",
    metrics: { views: 2891, downloads: 743, likes: 221, bookmarks: 148, shares: 58 },
    publishedAt: "2024-06-03T09:00:00Z",
    createdAt: "2024-05-08T10:00:00Z",
    updatedAt: "2024-06-03T09:00:00Z"
  }
];

// In-memory session store (survives within a single warm lambda instance)
const sessionStore: Map<string, { userId: string; createdAt: number }> = new Map();
// Runtime-registered users (demo users + any registered during session)
const runtimeUsers: DemoUser[] = [...DEMO_USERS];

// ─── Types ────────────────────────────────────────────────────────────────────

interface DemoUser {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "student" | "reviewer" | "admin";
  avatarUrl?: string;
  university?: string;
  bio?: string;
  skills: string[];
  socialLinks: { label: string; url: string }[];
  followers: number;
  following: number;
  createdAt: string;
  lastLoginAt: string;
}

interface DemoPublication {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  summary?: string;
  keywords: string[];
  tags: string[];
  category: string;
  authors: { name: string; email?: string; affiliation?: string }[];
  owner: ReturnType<typeof publicUser>;
  pdfUrl: string;
  coverImageUrl?: string;
  citation?: string;
  status: string;
  metrics: { views: number; downloads: number; likes: number; bookmarks: number; shares: number };
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function publicUser(u: DemoUser) {
  return {
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
    university: u.university,
    bio: u.bio,
    skills: u.skills,
    socialLinks: u.socialLinks,
    followers: u.followers,
    following: u.following,
    createdAt: u.createdAt
  };
}

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function signAccess(payload: { id: string; role: string }) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

function signRefresh(payload: { id: string }) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "30d" });
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) { res.status(401).json({ error: { message: "Authentication required" } }); return; }
  try {
    req.user = jwt.verify(token, ACCESS_SECRET) as { id: string; role: string };
    next();
  } catch {
    res.status(401).json({ error: { message: "Invalid or expired token" } });
  }
}

// ─── Express App ──────────────────────────────────────────────────────────────

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "researchhub-api", mode: "demo", timestamp: new Date().toISOString() });
});

// ── Auth ──────────────────────────────────────────────────────────────────────
app.post("/api/v1/auth/register", (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    res.status(400).json({ error: { message: "name, username, email, and password are required" } });
    return;
  }
  const exists = runtimeUsers.find(u => u.email === email || u.username === username);
  if (exists) { res.status(409).json({ error: { message: "Email or username already exists" } }); return; }

  const newUser: DemoUser = {
    id: `usr_${Date.now()}`,
    name, username: username.toLowerCase(), email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: "student",
    skills: [], socialLinks: [],
    followers: 0, following: 0,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
  runtimeUsers.push(newUser);
  const accessToken = signAccess({ id: newUser.id, role: newUser.role });
  const refreshToken = signRefresh({ id: newUser.id });
  sessionStore.set(refreshToken, { userId: newUser.id, createdAt: Date.now() });
  res.status(201).json({ user: publicUser(newUser), accessToken, refreshToken, message: "Account created successfully" });
});

app.post("/api/v1/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: { message: "email and password are required" } });
    return;
  }
  const user = runtimeUsers.find(u => u.email === email.toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: { message: "Invalid credentials. Demo accounts: arjun@demo.researchhub.app / Demo@1234" } });
    return;
  }
  user.lastLoginAt = new Date().toISOString();
  const accessToken = signAccess({ id: user.id, role: user.role });
  const refreshToken = signRefresh({ id: user.id });
  sessionStore.set(refreshToken, { userId: user.id, createdAt: Date.now() });
  res.json({ user: publicUser(user), accessToken, refreshToken });
});

app.post("/api/v1/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) { res.status(401).json({ error: { message: "Refresh token required" } }); return; }
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };
    if (!sessionStore.has(refreshToken)) { res.status(401).json({ error: { message: "Session expired" } }); return; }
    const user = runtimeUsers.find(u => u.id === payload.id);
    if (!user) { res.status(401).json({ error: { message: "User not found" } }); return; }
    res.json({ accessToken: signAccess({ id: user.id, role: user.role }) });
  } catch {
    res.status(401).json({ error: { message: "Invalid refresh token" } });
  }
});

app.post("/api/v1/auth/logout", (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) sessionStore.delete(refreshToken);
  res.json({ ok: true });
});

app.post("/api/v1/auth/forgot-password", (req, res) => {
  res.json({ message: `Password reset email queued for ${req.body.email} (demo mode — no email sent)` });
});

app.post("/api/v1/auth/verify-email", (_req, res) => {
  res.json({ message: "Email verified (demo mode)" });
});

app.post("/api/v1/auth/google", (_req, res) => {
  res.json({ message: "Google OAuth not available in demo mode" });
});

// ── Publications ──────────────────────────────────────────────────────────────
app.get("/api/v1/publications", (req, res) => {
  const { q, category, sort = "latest", page = "1", limit = "12" } = req.query as Record<string, string>;
  let pubs = DEMO_PUBLICATIONS.filter(p => p.status === "published");

  if (category) pubs = pubs.filter(p => p.category === category);
  if (q) {
    const qLow = q.toLowerCase();
    pubs = pubs.filter(p =>
      p.title.toLowerCase().includes(qLow) ||
      p.abstract.toLowerCase().includes(qLow) ||
      p.keywords.some(k => k.toLowerCase().includes(qLow)) ||
      p.tags.some(t => t.toLowerCase().includes(qLow))
    );
  }

  if (sort === "trending") pubs.sort((a, b) => b.metrics.views - a.metrics.views);
  else if (sort === "downloads") pubs.sort((a, b) => b.metrics.downloads - a.metrics.downloads);
  else pubs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(24, parseInt(limit));
  const total = pubs.length;
  const paginated = pubs.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    publications: paginated,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
  });
});

app.get("/api/v1/publications/:slug", (req, res) => {
  const pub = DEMO_PUBLICATIONS.find(p => p.slug === req.params.slug && p.status === "published");
  if (!pub) { res.status(404).json({ error: { message: "Publication not found" } }); return; }
  pub.metrics.views++;
  res.json({ publication: pub });
});

app.post("/api/v1/publications", requireAuth, (req: AuthRequest, res) => {
  const { title, abstract, category, authors, pdfUrl } = req.body;
  if (!title || !abstract || !category) {
    res.status(400).json({ error: { message: "title, abstract, and category are required" } });
    return;
  }
  const owner = runtimeUsers.find(u => u.id === req.user!.id)!;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${Date.now().toString(36)}`;
  const newPub: DemoPublication = {
    id: `pub_${Date.now()}`,
    title, slug, abstract,
    keywords: req.body.keywords ?? [],
    tags: req.body.tags ?? [],
    category, authors: authors ?? [{ name: owner.name }],
    owner: publicUser(owner),
    pdfUrl: pdfUrl ?? "https://arxiv.org/pdf/placeholder",
    coverImageUrl: req.body.coverImageUrl,
    citation: `${owner.name}. (${new Date().getFullYear()}). ${title}. ResearchHub.`,
    status: "in_review",
    metrics: { views: 0, downloads: 0, likes: 0, bookmarks: 0, shares: 0 },
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  DEMO_PUBLICATIONS.push(newPub);
  res.status(201).json({ publication: newPub });
});

app.post("/api/v1/publications/:id/like", requireAuth, (req, res) => {
  const pub = DEMO_PUBLICATIONS.find(p => p.id === req.params.id);
  if (pub) pub.metrics.likes++;
  res.json({ ok: true, likes: pub?.metrics.likes ?? 0 });
});

app.post("/api/v1/publications/:id/bookmark", requireAuth, (req, res) => {
  const pub = DEMO_PUBLICATIONS.find(p => p.id === req.params.id);
  if (pub) pub.metrics.bookmarks++;
  res.json({ ok: true, bookmarks: pub?.metrics.bookmarks ?? 0 });
});

app.post("/api/v1/publications/:id/download", (req, res) => {
  const pub = DEMO_PUBLICATIONS.find(p => p.id === req.params.id);
  if (pub) pub.metrics.downloads++;
  res.json({ ok: true, downloads: pub?.metrics.downloads ?? 0 });
});

app.patch("/api/v1/publications/:id/review", requireAuth, (req: AuthRequest, res) => {
  if (!["reviewer", "admin"].includes(req.user!.role)) {
    res.status(403).json({ error: { message: "Reviewer or admin role required" } });
    return;
  }
  const pub = DEMO_PUBLICATIONS.find(p => p.id === req.params.id);
  if (!pub) { res.status(404).json({ error: { message: "Publication not found" } }); return; }
  Object.assign(pub, req.body, { updatedAt: new Date().toISOString() });
  res.json({ publication: pub });
});

// ── Users ─────────────────────────────────────────────────────────────────────
app.get("/api/v1/users/:username", (req, res) => {
  const user = runtimeUsers.find(u => u.username === req.params.username.toLowerCase());
  if (!user) { res.status(404).json({ error: { message: "User not found" } }); return; }
  const publications = DEMO_PUBLICATIONS.filter(
    p => (p.owner as any).username === user.username && p.status === "published"
  );
  res.json({ user: publicUser(user), publications });
});

app.patch("/api/v1/users/me", requireAuth, (req: AuthRequest, res) => {
  const user = runtimeUsers.find(u => u.id === req.user!.id);
  if (!user) { res.status(404).json({ error: { message: "User not found" } }); return; }
  const allowed = ["name", "bio", "university", "skills", "socialLinks", "avatarUrl"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) (user as any)[key] = req.body[key];
  }
  res.json({ user: publicUser(user) });
});

app.post("/api/v1/users/:username/follow", requireAuth, (_req, res) => {
  res.json({ ok: true });
});

// ── AI ────────────────────────────────────────────────────────────────────────
app.post("/api/v1/ai/generate", (req, res) => {
  const { type, input = "", title = "", authors = [] } = req.body;
  let result: string | string[];
  switch (type) {
    case "abstract":
      result = `This study explores ${String(input).slice(0, 180)}. The research presents a systematic investigation of the problem domain, employing state-of-the-art methodologies to evaluate performance across multiple benchmarks. Results demonstrate significant improvements over existing baselines, with implications for both academic research and practical applications.`;
      break;
    case "keywords":
      result = Array.from(
        new Set(String(input).toLowerCase().match(/[a-z]{5,}/g)?.slice(0, 8) ?? [])
      ).concat(["machine learning", "research", "innovation"]).slice(0, 8);
      break;
    case "citation":
      result = `${(authors as string[]).join(", ") || "Author, A."}. (${new Date().getFullYear()}). ${title || "Research Paper"}. ResearchHub. ${APP_URL}`;
      break;
    default:
      result = `Summary: ${String(input).slice(0, 500)}${String(input).length > 500 ? "..." : ""}`;
  }
  res.json({ result });
});

// ── Uploads (demo stub) ───────────────────────────────────────────────────────
app.post("/api/v1/uploads/asset", requireAuth, (_req, res) => {
  res.status(201).json({
    asset: {
      url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
      publicId: "researchhub/pdfs/demo-sample",
      type: "pdf",
      bytes: 204800
    },
    message: "File upload simulated in demo mode. Use a real Cloudinary account for actual uploads."
  });
});

// ── Admin ─────────────────────────────────────────────────────────────────────
app.get("/api/v1/admin/analytics", requireAuth, (req: AuthRequest, res) => {
  if (req.user!.role !== "admin") { res.status(403).json({ error: { message: "Admin only" } }); return; }
  res.json({
    users: runtimeUsers.length,
    publications: DEMO_PUBLICATIONS.filter(p => p.status === "published").length,
    pending: DEMO_PUBLICATIONS.filter(p => p.status === "in_review").length,
    totalViews: DEMO_PUBLICATIONS.reduce((s, p) => s + p.metrics.views, 0),
    totalDownloads: DEMO_PUBLICATIONS.reduce((s, p) => s + p.metrics.downloads, 0)
  });
});

app.get("/api/v1/admin/users", requireAuth, (req: AuthRequest, res) => {
  if (req.user!.role !== "admin") { res.status(403).json({ error: { message: "Admin only" } }); return; }
  res.json({ users: runtimeUsers.map(publicUser) });
});

app.get("/api/v1/admin/publications/review", requireAuth, (req: AuthRequest, res) => {
  if (!["reviewer", "admin"].includes(req.user!.role)) { res.status(403).json({ error: { message: "Reviewer or admin only" } }); return; }
  res.json({ publications: DEMO_PUBLICATIONS.filter(p => p.status === "in_review") });
});

// ── Root & API index ──────────────────────────────────────────────────────────
const demoPayload = () => ({
  name: "ResearchHub API",
  version: "1.0.0",
  mode: "demo",
  status: "operational",
  timestamp: new Date().toISOString(),
  description: "ResearchHub API is running in showcase/demo mode with 12 seeded research publications and 5 demo user accounts. No database or external services required.",
  demoAccounts: [
    { email: "arjun@demo.researchhub.app", password: "Demo@1234", role: "student" },
    { email: "priya@demo.researchhub.app", password: "Demo@1234", role: "reviewer" },
    { email: "rohan@demo.researchhub.app", password: "Demo@1234", role: "student" },
    { email: "sneha@demo.researchhub.app", password: "Demo@1234", role: "student" },
    { email: "admin@demo.researchhub.app", password: "Admin@1234", role: "admin" }
  ],
  stats: {
    publications: DEMO_PUBLICATIONS.filter(p => p.status === "published").length,
    users: DEMO_USERS.length,
    categories: [...new Set(DEMO_PUBLICATIONS.map(p => p.category))]
  },
  endpoints: {
    root: "GET /",
    health: "GET /health",
    demo: "GET /api/v1/demo",
    publications: "GET /api/v1/publications?q=&category=&sort=latest|trending|downloads&page=1",
    publicationDetail: "GET /api/v1/publications/:slug",
    userProfile: "GET /api/v1/users/:username",
    login: "POST /api/v1/auth/login  { email, password }",
    register: "POST /api/v1/auth/register  { name, username, email, password }",
    aiGenerate: "POST /api/v1/ai/generate  { type: abstract|keywords|citation|summary, input }"
  }
});

app.get("/", (_req, res) => res.json(demoPayload()));
app.get("/api", (_req, res) => res.json(demoPayload()));
app.get("/api/v1", (_req, res) => res.json(demoPayload()));

// ── Demo info ─────────────────────────────────────────────────────────────────
app.get("/api/v1/demo", (_req, res) => {
  res.json({
    mode: "demo",
    message: "ResearchHub API is running in demo mode with in-memory seed data.",
    demoAccounts: [
      { email: "arjun@demo.researchhub.app", password: "Demo@1234", role: "student" },
      { email: "priya@demo.researchhub.app", password: "Demo@1234", role: "reviewer" },
      { email: "rohan@demo.researchhub.app", password: "Demo@1234", role: "student" },
      { email: "sneha@demo.researchhub.app", password: "Demo@1234", role: "student" },
      { email: "admin@demo.researchhub.app", password: "Admin@1234", role: "admin" }
    ],
    publications: DEMO_PUBLICATIONS.length,
    endpoints: {
      health: "GET /health",
      demo: "GET /api/v1/demo",
      publications: "GET /api/v1/publications",
      login: "POST /api/v1/auth/login",
      register: "POST /api/v1/auth/register"
    }
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.path} not found` } });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[researchhub]", err);
  res.status(500).json({ error: { message: err.message ?? "Unexpected server error" } });
});

export default app;
