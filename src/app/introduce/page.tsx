import InViewHelper from "@/components/common/in-view-helper";
import ContentBox from "@/components/layout/content-box";

export default async function IntroducePage() {
  return (
    <ContentBox>
      <MyInView>
        <h1 className="mt-32 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-5xl font-bold text-transparent">
          What is PIU DB?
        </h1>
      </MyInView>
    </ContentBox>
  );
}

function MyInView({ children }: { children: React.ReactNode }) {
  return (
    <InViewHelper
      anyClass="transition duration-1000 opacity-0"
      inClass="opacity-100"
      outClass="translate-y-[1rem]"
    >
      {children}
    </InViewHelper>
  );
}
