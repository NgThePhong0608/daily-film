import FeedbackForm from "@/components/feedback/FeedbackForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FeedbackSection() {
  return (
    <section className="mt-8">
      <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-card via-card to-card/70">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-2xl sm:text-3xl">
            Góp ý cho Daily Film
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <FeedbackForm />
        </CardContent>
      </Card>
    </section>
  );
}
