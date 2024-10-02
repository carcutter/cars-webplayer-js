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
            Customise
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
                <CodeBlock className="container" language="tsx">
                  {`<WebPlayer compositionUrl="${DEFAULT_COMPOSITION_URL}" />`}
                </CodeBlock>
              </div>
            );
          }}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
