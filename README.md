# Reproduced Papers

[https://reproducedpapers.org](https://reproducedpapers.org) is an online hub for deep learning papers and their reproductions. It aims to provide a platform for both sharing and accessing reproductions, including their code and reproduction procedures (e.g., a blog post), all in one place.

Originally developed as part of an NWO grant for the CS4240 Deep Learning course at TU Delft ([https://www.tudelft.nl/](https://www.tudelft.nl/)), the platform facilitates.

## Installation

This application is built with Vite ([https://vitejs.dev/](https://vitejs.dev/)) and React ([https://reactjs.org/](https://reactjs.org/)) and leverages Firebase ([https://firebase.google.com/](https://firebase.google.com/)) for the backend and Algolia ([https://www.algolia.com/](https://www.algolia.com/)) for the search index. To run the application locally, follow these steps:

1. Install Bun ([https://bun.sh/](https://bun.sh/)) and the Firebase CLI ([https://firebase.google.com/docs/cli/](https://firebase.google.com/docs/cli/)).
2. Clone this Git repository to your machine by running:

```bash
git clone https://github.com/byildiz/reproduced-papers.git
```

3. Create separate projects in both [Firebase](https://firebase.google.com/) and [Algolia](https://www.algolia.com/).
4. Deploy the Firestore indexes, rules, and storage rules using:

```bash
firebase deploy --only firestore:rules firestore:indexes storage:rules
```

(Note that index creation might take some time.)

5. Copy the `.env.example` file and rename it to `.env`. Fill in the required configurations.
6. Install dependencies by running:

```bash
bun install
```

7. Start the application in development mode:

```bash
bun run dev
```

or in production mode, run:

```bash
bun run build && bun run preview
```

## Paper

We authored a paper titled _[ReproducedPapers.org: an open online repository for teaching and structuring machine learning reproducibility](https://arxiv.org/abs/2012.01172)_ that discusses the importance and need for an online repository of reproductions. The paper was published at the _[RRPR 2020: Third ICPR Workshop on Reproducible Research in Pattern Recognition](https://rrpr2020.sciencesconf.org/)_.

For the paper, we conducted two small, anonymous surveys on two groups:

- Students who recently added their reproductions to our repository.
- Individuals who identify themselves as working in AI.

You can download the survey data here: [survey-data.zip](./public/survey-data.zip).

## Contribution

There are several ways to contribute to the project:

1. Submit your papers and reproductions to [https://reproducedpapers.org](https://reproducedpapers.org).
2. Share [https://reproducedpapers.org](https://reproducedpapers.org) with your colleagues.
3. Help improve this web application by adding features or fixing bugs. We welcome pull requests!
