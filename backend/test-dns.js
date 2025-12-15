const dns = require('dns');

const hostname = 'db.xlknwckwjbjvchpwiugf.supabase.co';

console.log(`Resolving ${hostname}...`);

dns.resolve4(hostname, (err, addresses) => {
    if (err) console.error('IPv4 Error:', err.code);
    else console.log('IPv4 Addresses:', addresses);
});

dns.resolve6(hostname, (err, addresses) => {
    if (err) console.error('IPv6 Error:', err.code);
    else console.log('IPv6 Addresses:', addresses);
});

dns.lookup(hostname, (err, address, family) => {
    if (err) console.error('Lookup Error:', err.code);
    else console.log('Lookup Result:', address, 'Family: IPv', family);
});
