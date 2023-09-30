import { v4 as uuidv4 } from "uuid";

import { LowerIllustration, UpperIllustration } from "~/app/illustrations";
import { creationParametersSchema } from "~/lib/schemas/creations";
import { getUser } from "~/lib/server/supabase";
import { getCreation, getUserUploadUrl } from "~/lib/server/supabase-anon";
import { PredictionContextProvider } from "./context";
import { PredictionForm } from "./prediction-form";
import { PredictionOutput } from "./prediction-output";

import type { CreationParameters } from "~/lib/types/creations";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Make Your Own AI QR Code Art | Start Creating at Qriginals.com",
  description:
    "Get creative with your QR Codes. Use our customizable parameters to shape your QR Code Art exactly how you want.",
};

async function getTemplate(
  slug: string | undefined
): Promise<{ id: string; parameters: CreationParameters; url: string } | null> {
  if (!slug || slug === "new") return null;
  const creation = await getCreation(slug);
  if (!creation) throw new Error(`Creation not found for slug: ${slug}`);
  const parameters = creationParametersSchema.parse(creation.parameters ?? {});
  const url = getUserUploadUrl({
    creationId: creation.id,
    userId: creation.user_id,
    variant: "original",
  });
  return { id: creation.id, parameters, url };
}

export default async function Page(props: {
  params: { slug: string | undefined };
}) {
  const [user, template] = await Promise.all([
    getUser(),
    getTemplate(props.params.slug),
  ]);

  // 1. prevent duplicate creations, must be of same format as in db
  // 2. have it up here, since the uuid would be reseted for each render
  const creationId = uuidv4();

  return (
    <main className="isolate scroll-smooth">
      <div className="relative lg:pt-14">
        <UpperIllustration />
        <div className="pt-24 sm:pt-32">
          <h1 className="sr-only">QR Code AI Art Generator</h1>
          <PredictionContextProvider>
            <div className="max-w-2xl lg:max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-y-20 lg:gap-x-24 px-6 lg:px-8">
              <div className="basis-1/2">
                <PredictionForm
                  isAuthenticated={!!user}
                  template={
                    template
                      ? {
                          id: template.id,
                          parameters: template.parameters,
                        }
                      : null
                  }
                />
              </div>
              <div className="basis-1/2">
                <PredictionOutput
                  creationId={creationId}
                  templatePreviewImage={template?.url ?? null}
                />
              </div>
            </div>
          </PredictionContextProvider>
        </div>
        <div className="pt-24 sm:pt-32">
          <LowerIllustration />
        </div>
      </div>
    </main>
  );
}
