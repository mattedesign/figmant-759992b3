
-- Fix the user credits for mbrown@triumphpay.com
-- First, let's check if the user exists and fix their credits

DO $$
DECLARE
    user_record RECORD;
    user_uuid UUID;
BEGIN
    -- Get the user ID for mbrown@triumphpay.com
    SELECT id INTO user_uuid 
    FROM public.profiles 
    WHERE email = 'mbrown@triumphpay.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Check if user_credits record exists
        IF NOT EXISTS (SELECT 1 FROM public.user_credits WHERE user_id = user_uuid) THEN
            -- Create user_credits record with 5 welcome credits
            INSERT INTO public.user_credits (user_id, current_balance, total_purchased, total_used)
            VALUES (user_uuid, 5, 5, 0);
            
            -- Create the welcome bonus transaction
            INSERT INTO public.credit_transactions (
                user_id,
                transaction_type,
                amount,
                description,
                created_by
            ) VALUES (
                user_uuid,
                'purchase',
                5,
                'Welcome bonus - 5 free credits (manual fix)',
                user_uuid
            );
            
            RAISE NOTICE 'Created user_credits and welcome transaction for user %', user_uuid;
        ELSE
            -- Update existing record to ensure they have at least 5 credits
            UPDATE public.user_credits 
            SET 
                current_balance = GREATEST(current_balance, 5),
                total_purchased = GREATEST(total_purchased, 5),
                updated_at = now()
            WHERE user_id = user_uuid 
            AND current_balance < 5;
            
            -- Add welcome transaction if none exists
            IF NOT EXISTS (
                SELECT 1 FROM public.credit_transactions 
                WHERE user_id = user_uuid 
                AND description LIKE '%Welcome bonus%'
            ) THEN
                INSERT INTO public.credit_transactions (
                    user_id,
                    transaction_type,
                    amount,
                    description,
                    created_by
                ) VALUES (
                    user_uuid,
                    'purchase',
                    5,
                    'Welcome bonus - 5 free credits (manual fix)',
                    user_uuid
                );
            END IF;
            
            RAISE NOTICE 'Updated user_credits for user %', user_uuid;
        END IF;
        
        -- Ensure user_onboarding record exists
        INSERT INTO public.user_onboarding (user_id)
        VALUES (user_uuid)
        ON CONFLICT (user_id) DO NOTHING;
        
    ELSE
        RAISE NOTICE 'User with email mbrown@triumphpay.com not found';
    END IF;
END $$;

-- Verify the fix
SELECT 
    p.email,
    p.full_name,
    p.role,
    s.status as subscription_status,
    uc.current_balance,
    uc.total_purchased,
    uc.total_used,
    COUNT(ct.id) as transaction_count
FROM public.profiles p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
LEFT JOIN public.user_credits uc ON p.id = uc.user_id
LEFT JOIN public.credit_transactions ct ON p.id = ct.user_id
WHERE p.email = 'mbrown@triumphpay.com'
GROUP BY p.email, p.full_name, p.role, s.status, uc.current_balance, uc.total_purchased, uc.total_used;
