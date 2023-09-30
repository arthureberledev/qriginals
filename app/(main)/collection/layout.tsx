import { Container } from "~/components/container";
import { Tabs } from "./tabs";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection - Qriginals",
  robots: {
    follow: false,
    index: false,
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <Container withIllustration={false}>
      <Tabs />
      {props.children}
    </Container>
  );
}
