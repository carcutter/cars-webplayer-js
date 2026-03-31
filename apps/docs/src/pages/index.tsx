import BrowserOnly from "@docusaurus/BrowserOnly";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";

import Spinner from "../components/ui/Spinner";

import styles from "./index.module.css";

const DEFAULT_COMPOSITION_URL =
  "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Display CarCutter images and videos directly on your website"
    >
      <header className={styles.header}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <span className={styles.featureEyebrow}>Overview</span>
          <p className={styles.featureIntro}>
            The WebPlayer combines rich vehicle media, lightweight delivery, and
            flexible embeds so product teams can publish interactive car
            experiences without a custom integration.
          </p>
        </div>
      </header>
      <main className={clsx("container", styles.main)}>
        <div className={styles.ctas}>
          <Link
            className="button button--primary button--lg"
            to="/docs/category/installation"
          >
            Get Started
          </Link>
          <Link
            className="button button--outline button--primary button--lg"
            to="/docs/properties"
          >
            Customize
          </Link>
        </div>

        <BrowserOnly
          fallback={
            <div className={`${styles.container} ${styles.spinnerWrapper}`}>
              <Spinner color="primary" size="lg" />
            </div>
          }
        >
          {() => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const WebPlayer = require("@car-cutter/react-webplayer").WebPlayer;

            return (
              <div>
                <div className={`${styles.container} ${styles.playerWrapper}`}>
                  <WebPlayer compositionUrl={DEFAULT_COMPOSITION_URL} />
                </div>
                <section className={styles.featurePanel}>
                  <div className={styles.featureContent}>
                    <CodeBlock
                      className={styles.featureCodeBlock}
                      language="tsx"
                    >
                      {`<WebPlayer compositionUrl="${DEFAULT_COMPOSITION_URL}" />`}
                    </CodeBlock>
                    <div className={styles.featureGrid}>
                      <article className={styles.featureCard}>
                        <span className={styles.featureIcon} aria-hidden="true">
                          🚗
                        </span>
                        <p className={styles.featureLabel}>
                          What the WebPlayer is
                        </p>
                        <p className={styles.featureDescription}>
                          A JavaScript library for embedding a car media viewer
                          that supports 360° exterior views, interior 360°
                          panoramas, images, and videos.
                        </p>
                      </article>

                      <article className={styles.featureCard}>
                        <span className={styles.featureIcon} aria-hidden="true">
                          ⚡️
                        </span>
                        <p className={styles.featureLabel}>Its superpowers</p>
                        <p className={styles.featureDescription}>
                          Zero-dependency embed, multi-framework support, media
                          composition, customizable theming, analytics hooks,
                          and performance-tunable loading.
                        </p>
                      </article>

                      <article className={styles.featureCard}>
                        <span className={styles.featureIcon} aria-hidden="true">
                          🐣
                        </span>
                        <p className={styles.featureLabel}>
                          Ease of integration
                        </p>
                        <p className={styles.featureDescription}>
                          One line of code and a composition URL are enough to
                          render a working player for any CarCutter client.
                        </p>
                      </article>

                      <article className={styles.featureCard}>
                        <span className={styles.featureIcon} aria-hidden="true">
                          💾
                        </span>
                        <p className={styles.featureLabel}>
                          Preferred installation path
                        </p>
                        <p className={styles.featureDescription}>
                          The script-based Web Component is framework-agnostic,
                          auto-updating, and easy to scale through simple HTML
                          attributes.
                        </p>
                      </article>
                    </div>
                  </div>
                </section>
              </div>
            );
          }}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
