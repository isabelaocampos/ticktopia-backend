import { Controller, Post, Req, Headers, UnauthorizedException } from '@nestjs/common';
import { TicketService } from '../ticket/ticket.service';
import Stripe from 'stripe';

@Controller('webhook')
export class WebhookController {
    private stripe: Stripe;

    constructor(
        private readonly ticketService: TicketService,
    ) {

        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    }


    @Post('stripe')
    async activateTicket(@Req() req: Request, @Headers('stripe-signature') stripeSignature: string,
    ) {
        let event: any;
        const body = req.body!.toString();
        try {
            event = this.stripe.webhooks.constructEvent(body, stripeSignature, process.env.STRIPE_SIGNATURE!);
        }
        catch (err) {
            console.log(err);
            throw new UnauthorizedException(`Webhook Error: ${err.message}`);
        }
        const bodys = JSON.parse(body);
        const ticketIds = JSON.parse(bodys.data.object.metadata.ticketIds);
        ticketIds.forEach(async (ticketId: string) => {
            await this.ticketService.update(ticketId, { isActive: true });
        });
        return { received: true }
    }
}
