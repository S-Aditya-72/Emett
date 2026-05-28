interface CampaignDetailsPageProps {
  params: {
    campaignId: string;
  };
}

export default function CampaignDetailsPage({ params }: CampaignDetailsPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Campaign: {params.campaignId}</h1>
    </main>
  );
}
