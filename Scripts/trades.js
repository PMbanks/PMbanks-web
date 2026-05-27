import {
supabase
}
from "./supabase.js";
let trades = [];
export async function loadTrades(){

    const {
        data,
        error
    } = await supabase
    .from('trades')
    .select('*')
    .order('createdat', {
        ascending:false
    });

    if(error){

        console.error(error);

        return [];
    }

    trades = data || [];

    listeners.forEach(
        listener => listener(trades)
    );

    return trades;
}
const listeners = [];
export async function addTrade(trade){

    trades.unshift(trade);

    const {
        error
    } = await supabase
    .from('trades')
    .insert([trade]);

    if(error){

        console.error(error);

        return;
    }

    listeners.forEach(
        listener => listener(trades)
    );

}
export function getTrades(){

    return trades;

}
export async function saveTrades(){

    for(const trade of trades){

        await supabase
        .from('trades')
        .upsert(trade);

    }

    listeners.forEach(
        listener => listener(trades)
    );
}
export function deleteTrade(id){

    trades = trades.filter(
        trade => trade.id !== id
    );

    saveTrades();
}

export function subscribe(callback){

    listeners.push(callback);

}
loadTrades();
