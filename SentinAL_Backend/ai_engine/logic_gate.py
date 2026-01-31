from datetime import date

def check_breach(contract, scraped_location, scraped_duration):
    """
    Returns: 'CLEAN', 'PIRACY', 'TERRITORY', or 'INTEGRITY_VIOLATION'
    """
    
    # 1. INTEGRITY CHECK (New Logic)
    # We allow a tolerance of 5 minutes. If difference is > 5 mins, it's modified.
    if scraped_duration > 0 and contract.official_runtime > 0:
        diff = abs(scraped_duration - contract.official_runtime)
        if diff > 5:
            print(f"   [!] Content Manipulation Detected! Diff: {diff} mins")
            return "INTEGRITY_VIOLATION"

    # 2. Expiry Check
    if contract.expiry_date < date.today():
        return "EXPIRED_LICENSE"

    # 3. Territory Check
    allowed_list = [code.strip().upper() for code in contract.allowed_territory.split(',')]
    if scraped_location.upper() not in allowed_list:
        return "TERRITORY"

    return "CLEAN"