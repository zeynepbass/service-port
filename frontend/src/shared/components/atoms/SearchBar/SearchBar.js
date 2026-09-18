import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import {Input} from "@/shared/components/atoms"
export function SearchBar({setOpen,open,value,onChange}){
    return(
        <div className="flex items-center rounded-full pr-2 bg-[rgb(242,247,250)] shadow-inner focus-within:ring-1 focus-within:ring-[rgb(34,44,49)]">
        <Input
              placeholder="Başka bir ihtiyacın?"
              className="flex-1 p-3 rounded-full bg-transparent text-gray-700 focus:outline-none"
              value={value}
              onChange={onChange}
        />

             <SavedSearchIcon
               className="cursor-pointer text-[rgb(78,36,77)] mr-3"
               onClick={() => setOpen(!open)}
             />
           </div>
    )
}