interface ParsedMessage {
  senderName: string;
  amount: number;
  memberId: string;
  date: string;
}

export function parsePaymentMessage(message: string, source: 'SMS' | 'Email'): ParsedMessage | null {
  try {
    // Regex patterns for different payment services
    const patterns = {
      zelle: {
        amount: /\$?([\d,]+\.?\d*)/,
        sender: /from\s+([A-Za-z\s]+)/i,
        memo: /memo:\s*(?:member\s*id\s*)?(\d+)/i,
      },
      venmo: {
        amount: /\$?([\d,]+\.?\d*)/,
        sender: /from\s+([A-Za-z\s]+)/i,
        memo: /note:\s*(?:member\s*id\s*)?(\d+)/i,
      },
      cashapp: {
        amount: /\$?([\d,]+\.?\d*)/,
        sender: /from\s+([A-Za-z\s]+)/i,
        memo: /note:\s*(?:account\s*no\s*)?(\d+)/i,
      },
      mpesa: {
        amount: /ksh\s*([\d,]+\.?\d*)/i,
        sender: /from\s+([A-Za-z\s]+)/i,
        memo: /account:\s*(\d+)/i,
      },
    };

    // Try each pattern
    for (const [service, pattern] of Object.entries(patterns)) {
      const amountMatch = message.match(pattern.amount);
      const senderMatch = message.match(pattern.sender);
      const memoMatch = message.match(pattern.memo);

      if (amountMatch && senderMatch && memoMatch) {
        return {
          senderName: senderMatch[1].trim(),
          amount: parseFloat(amountMatch[1].replace(/,/g, '')),
          memberId: memoMatch[1],
          date: new Date().toISOString(),
        };
      }
    }

    // Generic fallback patterns
    const genericAmount = message.match(/\$?([\d,]+\.?\d*)/);
    const genericSender = message.match(/from\s+([A-Za-z\s]+)/i);
    const genericMemo = message.match(/(?:id|member|account|note|memo):\s*(\d+)/i);

    if (genericAmount && genericSender && genericMemo) {
      return {
        senderName: genericSender[1].trim(),
        amount: parseFloat(genericAmount[1].replace(/,/g, '')),
        memberId: genericMemo[1],
        date: new Date().toISOString(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing message:', error);
    return null;
  }
}

export function extractMemberIdFromMemo(memo: string): string | null {
  try {
    // Common patterns for member IDs
    const patterns = [
      /member\s*id\s*:?\s*(\d+)/i,
      /id\s*:?\s*(\d+)/i,
      /account\s*no\s*:?\s*(\d+)/i,
      /account\s*:?\s*(\d+)/i,
      /ref\s*:?\s*(\d+)/i,
      /(\d{6,})/,  // 6 or more digits
    ];

    for (const pattern of patterns) {
      const match = memo.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting member ID:', error);
    return null;
  }
}

export function validateParsedMessage(parsed: ParsedMessage): boolean {
  try {
    // Basic validation
    if (!parsed.senderName || parsed.senderName.trim().length === 0) {
      return false;
    }
    
    if (!parsed.amount || parsed.amount <= 0) {
      return false;
    }
    
    if (!parsed.memberId || parsed.memberId.length < 5) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating parsed message:', error);
    return false;
  }
}