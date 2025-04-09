using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;

public class BettingBoard : MonoBehaviour
{
    public GameObject bettingPanel;
    public Button[] symbolButtons;
    public TMP_InputField betAmountInput;
    public TextMeshProUGUI balanceText;
    public TextMeshProUGUI currentBetsText;

    private Dictionary<DiceGameManager.SymbolType, float> currentBets = new Dictionary<DiceGameManager.SymbolType, float>();
    private float currentBalance = 1000f;

    private void Start()
    {
        UpdateUI();
        for (int i = 0; i < symbolButtons.Length; i++)
        {
            int index = i;
            symbolButtons[i].onClick.AddListener(() => PlaceBet((DiceGameManager.SymbolType)index));
        }
    }

    public void PlaceBet(DiceGameManager.SymbolType symbol)
    {
        if (float.TryParse(betAmountInput.text, out float amount))
        {
            if (amount <= currentBalance)
            {
                if (currentBets.ContainsKey(symbol))
                {
                    currentBets[symbol] += amount;
                }
                else
                {
                    currentBets.Add(symbol, amount);
                }
                currentBalance -= amount;
                UpdateUI();
            }
        }
    }

    private void UpdateUI()
    {
        balanceText.text = $"Balance: ${currentBalance}";
        
        string betsText = "Current Bets:\n";
        foreach (var bet in currentBets)
        {
            betsText += $"{bet.Key}: ${bet.Value}\n";
        }
        currentBetsText.text = betsText;
    }

    public void ClearBets()
    {
        currentBets.Clear();
        UpdateUI();
    }

    public void ShowBettingPanel(bool show)
    {
        bettingPanel.SetActive(show);
    }
} 