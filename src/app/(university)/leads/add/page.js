// /app/leads/add/page.tsx

import {permanentRedirect, RedirectType} from "next/navigation";

export default function AddLeadPage() {
    permanentRedirect("/leads", RedirectType.replace)
    return null;
}
