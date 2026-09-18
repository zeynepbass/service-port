import {Button} from "@/shared/components/atoms"
export function HomeEmptyState({ tab }) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center pb-4  w-full text-center">
        {tab.image && (
          <img
            src={tab.image}
            className="w-[50vh]"
            alt=""
          />
        )}
  
        <p className=" text-[#222C31] ">
          {tab.content}
        </p>
  
        {tab.button && (
          <Button className="text-[#222C31] underline p-3 rounded-md mt-2">
            {tab.button}
          </Button>
        )}
      </div>
    );
  }