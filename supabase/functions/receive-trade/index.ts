import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { createClient }
from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {

    if(req.method === "OPTIONS"){
        return new Response("ok");
    }

    try {

        const body = await req.json();

const supabase = createClient(
    "https://rumotkgifvrnjxethqub.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bW90a2dpZnZybmp4ZXRocXViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg1NTA4NSwiZXhwIjoyMDk0NDMxMDg1fQ.2v49qQG3FEoFHjqej_yrgV-VjY-TzmvcOwAXmIkbrKA"
);

        const accountId =
        body.accountId || "UNASSIGNED";

        const symbol =
        body.symbol || "UNKNOWN";

        const pnl =
        body.pnl || 0;

        const direction =
        body.direction || "Long";
        const contracts =
body.contracts || 0;

const position =
body.position || 0;
const entryPrice =
body.entryPrice || 0;
const exitPrice =
body.exitPrice || 0;

        const accountName =
        accountId;

        const { data: existingAccount }
        = await supabase
        .from("accounts")
        .select("*")
        .eq("name", accountName)
        .single();

        if(!existingAccount){

            await supabase
            .from("accounts")
            .insert([{
                name: accountName,
                firm: "Unknown",
                type: "Imported",
                balance: 0,
                drawdown: 0,
                daily_loss: 0,
                profit_target: 0,
                status: "active"
            }]);

        }
await supabase
.from("trades")
.insert([{

    symbol,
    pnl,
    direction,
    accountId,
    contracts,
    position,
    entryPrice,
    exitPrice

}]);
console.log(error);
        return new Response(

            JSON.stringify({
                success:true
            }),

            {
headers:{
    "Content-Type":"application/json",
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"
}
            }

        );

    }

    catch(error){

        return new Response(

            JSON.stringify({
                error:error.message
            }),

            {
                status:500,
headers:{
    "Content-Type":"application/json",
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"
}
            }

        );

    }

});
