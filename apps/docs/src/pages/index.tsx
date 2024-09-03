import BrowserOnly from "@docusaurus/BrowserOnly";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";

import Spinner from "../components/ui/Spinner";

import styles from "./index.module.css";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
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
            to="/docs/customisation"
          >
            Customise
          </Link>
        </div>

        <div className={styles.webplayerWrapper}>
          <BrowserOnly
            fallback={
              <div className={styles.spinnerWrapper}>
                <Spinner color="primary" size="lg" />
              </div>
            }
          >
            {() => {
              const WebPlayer =
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require("@car-cutter/react-webplayer").WebPlayer;

              return (
                <WebPlayer compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json" />
              );
            }}
          </BrowserOnly>
        </div>
        <CodeBlock className="container" language="tsx">
          {`<WebPlayer compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json" />`}
        </CodeBlock>
      </main>
    </Layout>
  );
}
